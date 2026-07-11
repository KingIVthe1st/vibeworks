export interface SectionBounds {
  id: string
  top: number
  bottom: number
}

export interface DerivedActRange {
  id: string
  range: [number, number]
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

export function deriveActRanges(
  sections: readonly SectionBounds[],
  innerHeight: number,
  maxScroll: number,
): DerivedActRange[] {
  const scrollable = Math.max(1, maxScroll)
  let previousStart = 0
  let previousEnd = 0

  return sections.map(({ id, top, bottom }, index) => {
    const rawStart = (top - innerHeight * 0.55) / scrollable
    const rawEnd = (bottom - innerHeight * 0.45) / scrollable
    const start = id === 'hero' ? 0 : Math.max(previousStart, clamp01(rawStart))
    const end = Math.max(start, previousEnd, clamp01(rawEnd))
    previousStart = start
    previousEnd = end
    return { id, range: [start, end] }
  })
}

export function measureActRanges(): DerivedActRange[] {
  const sections = Array.from(document.querySelectorAll<HTMLElement>('section[data-act]'))
  const bounds = sections.map((section) => {
    const rect = section.getBoundingClientRect()
    return {
      id: section.dataset.act ?? '',
      top: rect.top + window.scrollY,
      bottom: rect.bottom + window.scrollY,
    }
  })
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  return deriveActRanges(bounds, window.innerHeight, maxScroll)
}

export function measurePlatformRanges(): DerivedActRange[] {
  const platforms = Array.from(document.querySelectorAll<HTMLElement>('#platforms article[data-platform]'))
  const bounds = platforms.map((platform) => {
    const rect = platform.getBoundingClientRect()
    return {
      id: platform.dataset.platform ?? '',
      top: rect.top + window.scrollY,
      bottom: rect.bottom + window.scrollY,
    }
  })
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  return deriveActRanges(bounds, window.innerHeight, maxScroll)
}

export function observeActLayout(onChange: () => void, debounceMs = 140): () => void {
  let timer = 0
  const schedule = () => {
    window.clearTimeout(timer)
    timer = window.setTimeout(onChange, debounceMs)
  }

  window.addEventListener('resize', schedule, { passive: true })
  if (document.readyState === 'complete') schedule()
  else window.addEventListener('load', schedule, { once: true })
  void document.fonts.ready.then(schedule)

  const observer = new ResizeObserver(schedule)
  observer.observe(document.body)

  return () => {
    window.clearTimeout(timer)
    window.removeEventListener('resize', schedule)
    window.removeEventListener('load', schedule)
    observer.disconnect()
  }
}
