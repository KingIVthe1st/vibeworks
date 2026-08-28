/**
 * Department page wiring: the load moment, scroll reveals, the chip group,
 * the week scrubber and the report card that types itself in.
 */

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initFloor, type FeedLine } from './floor'
import { initWeek } from './week'

/* --- the two placeholder targets, both swappable in one place ------------ */
const BOOK_HREF = 'mailto:info@vibeworksstudio.ai?subject=The%20map'
/** Leave empty to hide the secondary button entirely. */
const TEXT_NUMBER = ''

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

gsap.registerPlugin(ScrollTrigger)

function ready(fn: () => void) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true })
  else fn()
}

/* ------------------------------------------------------------------- CTAs */

function ctas() {
  const book = document.querySelector<HTMLAnchorElement>('[data-cta-book]')
  if (book) book.href = BOOK_HREF
  const text = document.querySelector<HTMLAnchorElement>('[data-cta-text]')
  if (!text) return
  if (TEXT_NUMBER) {
    text.href = `sms:${TEXT_NUMBER}`
    text.hidden = false
  } else {
    text.remove()
  }
}

/* ---------------------------------------------------------------- reveals */

function reveals() {
  const all = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
  const hero = all.filter((el) => el.closest('.dept-hero'))
  const rest = all.filter((el) => !el.closest('.dept-hero'))

  if (reduced) {
    document.body.classList.add('is-static')
    document.querySelectorAll('.dept-retain').forEach((el) => el.classList.add('is-in'))
    document.querySelector('[data-map-lamp]')?.classList.add('is-lit')
    return
  }

  // the one orchestrated load moment: the lamp is already blooming on the Floor,
  // so the words arrive just behind it
  gsap.to(hero, {
    opacity: 1,
    y: 0,
    duration: 0.72,
    ease: 'expo.out',
    stagger: 0.075,
    delay: 0.55,
  })

  ScrollTrigger.batch(rest, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => {
      gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.07, overwrite: true })
    },
  })

  // the Evolve tile draws its outer ring when the card arrives
  document.querySelectorAll<HTMLElement>('.dept-retain').forEach((card) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 82%',
      once: true,
      onEnter: () => card.classList.add('is-in'),
    })
  })

  // the page ends the way it opened: the lamp comes on over the last headline
  const mapLamp = document.querySelector<HTMLElement>('[data-map-lamp]')
  if (mapLamp) {
    ScrollTrigger.create({
      trigger: mapLamp.closest('section') ?? mapLamp,
      start: 'top 78%',
      once: true,
      onEnter: () => mapLamp.classList.add('is-lit'),
    })
  }
}

/* ------------------------------------------------------------------ floor */

function floor() {
  const root = document.querySelector<HTMLElement>('[data-floor]')
  const canvas = document.querySelector<HTMLCanvasElement>('[data-floor-canvas]')
  const chipHost = document.querySelector<HTMLElement>('[data-floor-chips]')
  const slip = document.querySelector<HTMLElement>('[data-slip]')
  const slipLines = slip?.querySelectorAll<HTMLElement>('[data-slip-lines] li')
  const feed = document.querySelector<HTMLElement>('[data-feed-lines]')
  if (!root || !canvas || !chipHost) return

  const FEED_MAX = 4

  function pushFeed(line: FeedLine | null) {
    if (!feed) return
    if (!line) {
      feed.replaceChildren()
      return
    }
    const li = document.createElement('li')
    if (line.tone) li.classList.add(`is-${line.tone}`)
    if (line.time) {
      const t = document.createElement('span')
      t.className = 'dept-feed-time'
      t.textContent = line.time
      li.append(t)
    }
    const text = document.createElement('span')
    text.className = 'dept-feed-text'
    text.textContent = line.text
    li.append(text)
    feed.prepend(li)
    while (feed.childElementCount > FEED_MAX) feed.lastElementChild?.remove()
  }

  const handle = initFloor(root, canvas, {
    onReport: (lines) => {
      if (!slip || !slipLines) return
      if (!lines) {
        slip.classList.remove('is-in')
        return
      }
      slipLines.forEach((li, i) => { li.textContent = lines[i] ?? '' })
      slip.classList.add('is-in')
    },
    onFeed: pushFeed,
  }, reduced)

  const chips = Array.from(chipHost.querySelectorAll<HTMLButtonElement>('[data-play]'))

  function mark(id: string) {
    chips.forEach((chip) => {
      const on = chip.dataset.play === id
      chip.setAttribute('aria-checked', String(on))
      chip.tabIndex = on ? 0 : -1
      // the phone rail scrolls sideways, so the live chip has to stay visible
      if (on && chipHost && chipHost.scrollWidth > chipHost.clientWidth + 4) {
        const left = chip.offsetLeft - (chipHost.clientWidth - chip.offsetWidth) / 2
        chipHost.scrollTo({ left: Math.max(0, left), behavior: reduced ? 'auto' : 'smooth' })
      }
    })
  }

  function pick(index: number, focus: boolean) {
    const chip = chips[(index + chips.length) % chips.length]
    if (!chip) return
    mark(chip.dataset.play!)
    handle.select(chip.dataset.play!, true)
    if (focus) chip.focus()
  }

  chips.forEach((chip, i) => {
    chip.addEventListener('click', () => pick(i, false))
    chip.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown': e.preventDefault(); pick(i + 1, true); break
        case 'ArrowLeft':
        case 'ArrowUp': e.preventDefault(); pick(i - 1, true); break
        case 'Home': e.preventDefault(); pick(0, true); break
        case 'End': e.preventDefault(); pick(chips.length - 1, true); break
        default: break
      }
    })
  })

  // keep the chip group honest while the Floor cycles on its own
  handle.onAutoSelect((id) => mark(id))
}

/* ------------------------------------------------------------ report card */

function reportCard() {
  const card = document.querySelector<HTMLElement>('[data-card]')
  if (!card) return
  const groups = Array.from(card.querySelectorAll<HTMLElement>('.dept-card-group'))
  if (reduced || !groups.length) return

  // stash the copy, then clear so each line can type itself in
  const plan = groups.map((group) =>
    Array.from(group.querySelectorAll<HTMLElement>('li')).map((li) => {
      const text = li.textContent ?? ''
      li.textContent = ''
      return { li, text }
    }),
  )

  let ran = false
  ScrollTrigger.create({
    trigger: card,
    start: 'top 75%',
    once: true,
    onEnter: () => {
      if (ran) return
      ran = true
      plan.forEach((rows, g) => {
        let at = g * 300
        for (const row of rows) {
          typeLine(row.li, row.text, at)
          at += row.text.length * 40 + 160
        }
      })
    },
  })
}

const CHAR_MS = 40

function typeLine(li: HTMLElement, text: string, delay: number) {
  window.setTimeout(() => {
    li.classList.add('is-typing')
    let i = 0
    const step = () => {
      i += 1
      li.textContent = text.slice(0, i)
      if (i < text.length) window.setTimeout(step, CHAR_MS)
      else li.classList.remove('is-typing')
    }
    step()
  }, delay)
}

/* ------------------------------------------------------------------- boot */

ready(() => {
  ctas()
  reveals()
  floor()
  reportCard()
  const week = document.querySelector<HTMLElement>('[data-week]')
  if (week) initWeek(week, reduced)
})
