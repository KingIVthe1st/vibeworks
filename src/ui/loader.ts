interface LoaderOptions {
  reducedMotion: boolean
}

declare global {
  interface Window {
    __vwLoaderStart?: number
  }
}

function firstViewportImagesReady(): Promise<void> {
  const images = Array.from(document.images).filter((image) => {
    const rect = image.getBoundingClientRect()
    return rect.top < window.innerHeight && rect.bottom > 0
  })
  return Promise.all(images.map(async (image) => {
    if (image.complete) {
      try { await image.decode() } catch { /* A failed decorative image must not block the page. */ }
      return
    }
    await new Promise<void>((resolve) => {
      image.addEventListener('load', () => resolve(), { once: true })
      image.addEventListener('error', () => resolve(), { once: true })
    })
    try { await image.decode() } catch { /* Decoding may reject after a handled load error. */ }
  })).then(() => undefined)
}

export async function initLoader({ reducedMotion }: LoaderOptions): Promise<void> {
  const overlay = document.querySelector<HTMLElement>('#site-loader')
  if (!overlay) return

  const gates = [document.fonts.ready.then(() => undefined), firstViewportImagesReady()]
  let completed = 0
  const tracked = gates.map((gate) => gate.catch(() => undefined).then(() => {
    completed += 1
    overlay.style.setProperty('--loader-progress', String(completed / gates.length))
  }))
  const elapsed = performance.now() - (window.__vwLoaderStart ?? performance.now())
  const remaining = Math.max(0, (reducedMotion ? 300 : 900) - elapsed)
  await Promise.race([
    Promise.all(tracked),
    new Promise<void>((resolve) => window.setTimeout(resolve, remaining)),
  ])

  overlay.style.setProperty('--loader-progress', '1')
  overlay.classList.add('is-leaving')
  overlay.setAttribute('aria-hidden', 'true')
  window.setTimeout(() => overlay.remove(), reducedMotion ? 220 : 460)
}
