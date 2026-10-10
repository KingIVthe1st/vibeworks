import '@fontsource-variable/bricolage-grotesque'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/consult-page.css'
import { formatDollars, meterPercent, meterScale, parseDollars, rankOpportunities } from './consult/opportunity-map'

/* The page is complete with this file switched off. The markup ships the
   finished Opportunity Map, ranked, priced and totalled. This file scrambles
   it while it is off screen and sorts it back when it scrolls into view.
   When motion is not wanted, it leaves the finished state alone. */

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
   The Opportunity Map
   ---------------------------------------------------------------------- */

/** The order the rows sit in before they sort, as indices into the ranked list. */
const SCRAMBLE = [3, 0, 5, 2, 4, 1]

const SORT_MS = 900
const SORT_STAGGER = 55
const COUNT_AT = 520
const COUNT_MS = 1100
const COUNT_STAGGER = 85
const METER_AT = 820
const METER_MS = 1900

const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3)
const easeInOut = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/** Runs a 0..1 tween on requestAnimationFrame, starting after a delay. */
function tween(delay: number, duration: number, ease: (t: number) => number, draw: (p: number) => void, done?: () => void): void {
  window.setTimeout(() => {
    const start = performance.now()
    const frame = (now: number): void => {
      const t = Math.min(1, (now - start) / duration)
      draw(ease(t))
      if (t < 1) requestAnimationFrame(frame)
      else done?.()
    }
    requestAnimationFrame(frame)
  }, delay)
}

function setupMap(root: HTMLElement): void {
  const list = root.querySelector<HTMLElement>('[data-map-rows]')
  const fill = root.querySelector<HTMLElement>('[data-meter-fill]')
  const totalLabel = root.querySelector<HTMLElement>('[data-meter-total]')
  const multipleLabel = root.querySelector<HTMLElement>('[data-meter-multiple]')
  const ticks = Array.from(root.querySelectorAll<HTMLElement>('[data-meter-tick]'))
  if (!list) return

  const parsed = Array.from(list.querySelectorAll<HTMLElement>('[data-map-row]')).map((el) => {
    const valueEl = el.querySelector<HTMLElement>('[data-map-value]')
    return {
      el,
      valueEl,
      workflow: el.querySelector('[data-map-work]')?.textContent?.trim() ?? '',
      hours: Number(el.querySelector('[data-map-hours]')?.textContent ?? ''),
      value: parseDollars(valueEl?.textContent ?? ''),
    }
  })
  if (parsed.length === 0 || parsed.some((row) => !row.valueEl || !Number.isFinite(row.value) || !Number.isFinite(row.hours))) return

  const fee = Number(root.dataset.fee)
  const summary = rankOpportunities(parsed, fee)
  const ranked = summary.rows as typeof parsed
  const top = ranked[0].value
  const scale = meterScale(summary.total)
  const finalFill = meterPercent(summary.total, scale)

  /* Settle the finished state from the numbers, so the markup can never
     disagree with its own arithmetic. */
  ranked.forEach((row, index) => {
    const rank = row.el.querySelector<HTMLElement>('.cs-map-rank')
    if (rank) rank.textContent = String(index + 1).padStart(2, '0')
    row.el.classList.toggle('is-top', index === 0)
    row.el.style.setProperty('--share', (row.value / top).toFixed(4))
  })
  list.replaceChildren(...ranked.map((row) => row.el))
  ticks.forEach((tick) => tick.style.setProperty('--at', `${meterPercent(Number(tick.dataset.meterTick), scale).toFixed(4)}%`))
  fill?.style.setProperty('--fill', `${finalFill.toFixed(4)}%`)
  if (totalLabel) totalLabel.textContent = formatDollars(summary.total)
  if (multipleLabel) multipleLabel.textContent = summary.multiple

  if (reduceMotion || !('IntersectionObserver' in window)) return

  /* Arm: scrambled order, empty figures, empty meter. */
  list.replaceChildren(...SCRAMBLE.filter((i) => i < ranked.length).map((i) => ranked[i].el))
  ranked.forEach((row) => { row.valueEl!.textContent = formatDollars(0) })
  fill?.style.setProperty('--fill', '0%')
  ticks.forEach((tick) => tick.classList.remove('is-passed'))
  if (totalLabel) totalLabel.textContent = formatDollars(0)
  root.classList.add('is-armed')

  const play = (): void => {
    /* FLIP the rows from scrambled to ranked. */
    const first = new Map(ranked.map((row) => [row.el, row.el.getBoundingClientRect().top]))
    list.replaceChildren(...ranked.map((row) => row.el))
    ranked.forEach((row) => {
      const delta = (first.get(row.el) ?? 0) - row.el.getBoundingClientRect().top
      row.el.style.transition = 'none'
      row.el.style.transform = `translate3d(0, ${delta}px, 0)`
      /* Rows climbing the ranking pass in front; rows dropping pass behind. */
      row.el.classList.toggle('is-rising', delta > 0)
      row.el.classList.toggle('is-sinking', delta < 0)
    })
    void list.offsetHeight
    ranked.forEach((row, index) => {
      row.el.style.transition = `transform ${SORT_MS}ms cubic-bezier(.16, 1, .3, 1) ${index * SORT_STAGGER}ms`
      row.el.style.transform = ''
    })
    root.classList.add('is-sorted')
    window.setTimeout(() => {
      ranked.forEach((row) => row.el.classList.remove('is-rising', 'is-sinking'))
    }, SORT_MS * 0.7 + ranked.length * SORT_STAGGER)

    /* Count each line up to its figure. */
    ranked.forEach((row, index) => {
      tween(COUNT_AT + index * COUNT_STAGGER, COUNT_MS, easeOut, (p) => {
        row.valueEl!.textContent = formatDollars(row.value * p)
      })
    })

    /* Fill the meter past the fee and the guarantee line, landing on the total. */
    tween(METER_AT, METER_MS, easeInOut, (p) => {
      const running = summary.total * p
      fill?.style.setProperty('--fill', `${(finalFill * p).toFixed(3)}%`)
      if (totalLabel) totalLabel.textContent = formatDollars(running)
      ticks.forEach((tick) => tick.classList.toggle('is-passed', running >= Number(tick.dataset.meterTick)))
    }, () => {
      if (totalLabel) totalLabel.textContent = formatDollars(summary.total)
      root.classList.add('is-done')
      ranked.forEach((row) => { row.el.style.transition = '' })
    })
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      observer.disconnect()
      play()
    }
  }, { threshold: 0.3 })

  observer.observe(list)
}

document.querySelectorAll<HTMLElement>('[data-map]').forEach(setupMap)
