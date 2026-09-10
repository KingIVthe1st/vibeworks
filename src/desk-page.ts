import '@fontsource-variable/bricolage-grotesque'
import '@fontsource/plus-jakarta-sans/400.css'
import '@fontsource/plus-jakarta-sans/600.css'
import '@fontsource/ibm-plex-mono/400.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/desk-page.css'
import { callDuration, formatClock, parseStamp, shownCount, speakingIndex, type CallLine } from './desk/call-timeline'

/* Every page here is complete with this file switched off. The markup ships
   the finished state of each animated block: the whole transcript, the filled
   intake card, the outcome row. This file resets those to the start and plays
   them. When motion is not wanted, it leaves the finished state alone. */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* -------------------------------------------------------------------------
   Scroll reveal
   ---------------------------------------------------------------------- */

const revealables = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealables.forEach((element) => element.classList.add('is-in'))
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      entry.target.classList.add('is-in')
      revealObserver.unobserve(entry.target)
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })

  revealables.forEach((element) => revealObserver.observe(element))
}

/* -------------------------------------------------------------------------
   Photograph parallax, capped at 6% of the frame
   ---------------------------------------------------------------------- */

const scenes = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'))

if (!reduceMotion && scenes.length > 0) {
  const arts = scenes
    .map((scene) => ({ scene, art: scene.querySelector<HTMLElement>('[data-parallax-art]') }))
    .filter((pair): pair is { scene: HTMLElement; art: HTMLElement } => pair.art !== null)

  let queued = false

  const drawParallax = (): void => {
    queued = false
    const viewport = window.innerHeight

    for (const { scene, art } of arts) {
      const box = scene.getBoundingClientRect()
      if (box.bottom < -160 || box.top > viewport + 160) continue

      const centre = box.top + box.height / 2
      const span = (viewport + box.height) / 2
      const progress = Math.max(-1, Math.min(1, (centre - viewport / 2) / span))
      art.style.transform = `translate3d(0, ${(progress * -6).toFixed(2)}%, 0)`
    }
  }

  const queueParallax = (): void => {
    if (queued) return
    queued = true
    requestAnimationFrame(drawParallax)
  }

  window.addEventListener('scroll', queueParallax, { passive: true })
  window.addEventListener('resize', queueParallax)
  drawParallax()
}

/* -------------------------------------------------------------------------
   Copy the number. Only offered when the clipboard is actually there.
   ---------------------------------------------------------------------- */

const copyButton = document.querySelector<HTMLButtonElement>('[data-copy-number]')

if (copyButton && navigator.clipboard) {
  const idleLabel = copyButton.textContent ?? 'Copy number'
  let restore = 0

  copyButton.hidden = false

  copyButton.addEventListener('click', () => {
    const number = copyButton.dataset.copyNumber ?? ''

    navigator.clipboard.writeText(number).then(
      () => {
        copyButton.textContent = 'Copied'
      },
      () => {
        copyButton.textContent = 'Could not copy'
      },
    )

    window.clearTimeout(restore)
    restore = window.setTimeout(() => {
      copyButton.textContent = idleLabel
    }, 2400)
  })
}

/* -------------------------------------------------------------------------
   FAQ: native <details>, this only closes the others
   ---------------------------------------------------------------------- */

const answers = document.querySelectorAll<HTMLDetailsElement>('[data-faq] details')

answers.forEach((answer) => {
  answer.addEventListener('toggle', () => {
    if (!answer.open) return

    answers.forEach((other) => {
      if (other !== answer) other.open = false
    })
  })
})

/* -------------------------------------------------------------------------
   Fourteen day strip
   ---------------------------------------------------------------------- */

document.querySelectorAll<HTMLElement>('[data-strip]').forEach((strip) => {
  const dayLabel = strip.querySelector<HTMLElement>('[data-strip-day-label]')
  const noteLabel = strip.querySelector<HTMLElement>('[data-strip-note]')
  const days = Array.from(strip.querySelectorAll<HTMLElement>('.strip-day'))
  if (!dayLabel || !noteLabel || days.length === 0) return

  const show = (day: HTMLElement | null): void => {
    days.forEach((other) => other.classList.toggle('is-active', other === day))
    dayLabel.textContent = day ? day.dataset.day ?? '' : ''
    noteLabel.textContent = day ? day.dataset.note ?? '' : ''
  }

  days.forEach((day) => {
    day.setAttribute('role', 'button')
    day.setAttribute('tabindex', '0')
    day.setAttribute('aria-label', `${day.dataset.day ?? ''}, ${day.dataset.note ?? ''}`)

    day.addEventListener('pointerenter', () => show(day))
    day.addEventListener('pointerleave', () => show(null))
    day.addEventListener('focus', () => show(day))
    day.addEventListener('blur', () => show(null))
    day.addEventListener('click', () => show(day))
    day.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      show(day)
    })
  })
})

/* -------------------------------------------------------------------------
   The Call
   ---------------------------------------------------------------------- */

function setupCall(root: HTMLElement): void {
  const lineElements = Array.from(root.querySelectorAll<HTMLElement>('[data-call-line]'))
  if (lineElements.length === 0) return

  const lines: CallLine[] = lineElements.map((element) => ({
    at: parseStamp(element.dataset.callLine ?? ''),
    words: (element.querySelector('[data-call-text]')?.textContent ?? '').trim().split(/\s+/).filter(Boolean).length,
  }))
  if (lines.some((line) => !Number.isFinite(line.at))) return

  const fieldElements = Array.from(root.querySelectorAll<HTMLElement>('[data-call-field]'))
  const fieldTimes = fieldElements.map((element) => Number(element.dataset.callField))
  const outcome = root.querySelector<HTMLElement>('[data-call-outcome]')
  const outcomeAt = Number(outcome?.dataset.callOutcome ?? 0)
  const wave = root.querySelector<HTMLElement>('[data-call-wave]')
  const clock = root.querySelector<HTMLElement>('[data-call-clock]')
  const progress = root.querySelector<HTMLElement>('[data-call-progress]')
  const script = root.querySelector<HTMLElement>('[data-call-script]')
  const playButton = root.querySelector<HTMLButtonElement>('[data-call-play]')
  const replayButton = root.querySelector<HTMLButtonElement>('[data-call-replay]')

  const duration = Math.max(callDuration(lines), outcomeAt + 1)

  let time = duration
  let playing = false
  let started = false
  let autoPaused = false
  let frame = 0
  let origin = 0
  let lastShown = lineElements.length
  let lastSpeaking = -1
  let lastFilled = fieldElements.length
  let lastClock = ''

  const paint = (at: number): void => {
    const shown = shownCount(lines, at)

    if (shown !== lastShown) {
      for (let index = 0; index < lineElements.length; index += 1) {
        lineElements[index].classList.toggle('is-shown', index < shown)
      }
      if (script && shown > lastShown && lastShown >= 0) {
        script.scrollTo({ top: script.scrollHeight, behavior: 'smooth' })
      }
      lastShown = shown
    }

    const speaking = speakingIndex(lines, at)

    if (speaking !== lastSpeaking) {
      if (lastSpeaking >= 0) lineElements[lastSpeaking]?.classList.remove('is-speaking')
      if (speaking >= 0) lineElements[speaking]?.classList.add('is-speaking')

      if (wave) {
        const who = speaking >= 0 ? lineElements[speaking].dataset.callWho : ''
        wave.classList.toggle('is-live', speaking >= 0)
        wave.classList.toggle('is-desk', who === 'desk')
        wave.classList.toggle('is-caller', who === 'caller')
      }

      lastSpeaking = speaking
    }

    let filled = 0
    for (const fieldTime of fieldTimes) {
      if (at + 1e-6 >= fieldTime) filled += 1
    }

    if (filled !== lastFilled) {
      for (let index = 0; index < fieldElements.length; index += 1) {
        fieldElements[index].classList.toggle('is-filled', at + 1e-6 >= fieldTimes[index])
      }
      lastFilled = filled
    }

    outcome?.classList.toggle('is-shown', at + 1e-6 >= outcomeAt)

    if (clock) {
      const reading = formatClock(Math.min(at, duration))
      if (reading !== lastClock) {
        clock.textContent = reading
        lastClock = reading
      }
    }

    if (progress) {
      progress.style.width = `${Math.min(100, (at / duration) * 100).toFixed(2)}%`
    }
  }

  const forgetState = (): void => {
    lastShown = -1
    lastSpeaking = -2
    lastFilled = -1
    lastClock = ''
  }

  const setLabel = (): void => {
    if (playButton) playButton.textContent = playing ? 'Pause' : 'Play the call'
  }

  const halt = (): void => {
    playing = false
    if (frame) cancelAnimationFrame(frame)
    frame = 0
    setLabel()
  }

  const step = (now: number): void => {
    const at = (now - origin) / 1000

    if (at >= duration) {
      time = duration
      paint(duration)
      halt()
      return
    }

    time = at
    paint(at)
    frame = requestAnimationFrame(step)
  }

  const play = (from?: number): void => {
    if (from !== undefined) {
      time = from
      forgetState()
    } else if (time >= duration) {
      time = 0
      forgetState()
    }

    started = true
    playing = true
    autoPaused = false
    origin = performance.now() - time * 1000
    paint(time)
    setLabel()
    if (frame) cancelAnimationFrame(frame)
    frame = requestAnimationFrame(step)
  }

  const reset = (): void => {
    halt()
    time = 0
    forgetState()
    paint(0)
    if (script) script.scrollTop = 0
  }

  if (reduceMotion) {
    /* The finished state is already in the markup. Leave it there. */
    return
  }

  reset()
  /* The controls row keeps its height with the buttons hidden, so revealing
     them moves nothing. */
  if (playButton) playButton.hidden = false
  if (replayButton) replayButton.hidden = false

  playButton?.addEventListener('click', () => {
    if (playing) {
      autoPaused = false
      halt()
    } else {
      play()
    }
  })

  replayButton?.addEventListener('click', () => play(0))

  lineElements.forEach((element, index) => {
    const bubble = element.querySelector<HTMLElement>('[data-call-jump]')
    if (!bubble) return

    bubble.setAttribute('role', 'button')
    bubble.setAttribute('tabindex', '0')

    const jump = (): void => play(lines[index].at + 0.02)

    bubble.addEventListener('click', jump)
    bubble.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      jump()
    })
  })

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden || !playing) return
    autoPaused = true
    halt()
  })

  if (!('IntersectionObserver' in window)) {
    play(0)
    return
  }

  const startObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting || started) continue
      play(0)
      startObserver.disconnect()
    }
  }, { threshold: 0, rootMargin: '0px 0px -22% 0px' })

  startObserver.observe(root)

  const holdObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting && playing) {
        autoPaused = true
        halt()
      } else if (entry.isIntersecting && autoPaused && !document.hidden) {
        play()
      }
    }
  }, { threshold: 0 })

  holdObserver.observe(root)
}

document.querySelectorAll<HTMLElement>('[data-call]').forEach(setupCall)
