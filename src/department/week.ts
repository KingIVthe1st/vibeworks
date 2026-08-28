/**
 * The week scrubber.
 *
 * One track running Monday 00:00 to the following Monday 12:00, and two rows of
 * events that light up as the handle passes their time. The top row is a tool
 * nobody is watching; the bottom row is a workflow we manage.
 */

interface WeekEvent {
  /** minutes since Monday 00:00 */
  at: number
  text: string
  tone?: 'alarm' | 'good'
}

const DAY = 1440
const MAX = 7 * DAY + 720 // through to the next Monday lunchtime
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon']

const TOP: WeekEvent[] = [
  { at: 1 * DAY + 612, text: 'Vendor changes its API. Nothing is logged.' },
  { at: 2 * DAY + 540, text: "Follow-ups stop. Screen still says 'sent'." },
  { at: 3 * DAY + 600, text: 'Six leads go cold.', tone: 'alarm' },
  { at: 7 * DAY + 580, text: 'A customer emails to ask why nobody replied.' },
]

const BOTTOM: WeekEvent[] = [
  { at: 1 * DAY + 612, text: 'Vendor changes its API.' },
  { at: 1 * DAY + 614, text: 'Watcher flags it to us.' },
  { at: 1 * DAY + 662, text: 'Fix live. Rolled back nothing, lost nothing.', tone: 'good' },
  { at: 1 * DAY + 665, text: 'Note in your thread: what changed, what we did.' },
  { at: 4 * DAY + 960, text: 'Weekly one-pager: 31 leads, 9 booked, 0 cold.' },
]

function stamp(minutes: number): string {
  const m = Math.max(0, Math.min(MAX, Math.round(minutes)))
  const day = DAYS[Math.min(DAYS.length - 1, Math.floor(m / DAY))]
  const mins = m % DAY
  const h24 = Math.floor(mins / 60)
  const mm = String(mins % 60).padStart(2, '0')
  const suffix = h24 < 12 ? 'am' : 'pm'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${day} ${h12}:${mm}${suffix}`
}

const LONG: Record<string, string> = {
  Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday',
  Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
}

function spoken(minutes: number): string {
  const s = stamp(minutes)
  const [day, time] = s.split(' ')
  return `${LONG[day] ?? day} ${time}`
}

export function initWeek(root: HTMLElement, reduced: boolean): void {
  const track = root.querySelector<HTMLElement>('[data-week-track]')
  const fill = root.querySelector<HTMLElement>('[data-week-fill]')
  const handle = root.querySelector<HTMLElement>('[data-week-handle]')
  const now = root.querySelector<HTMLElement>('[data-week-now]')
  const daysBar = root.querySelector<HTMLElement>('[data-week-days]')
  const topRow = root.querySelector<HTMLElement>('[data-week-row="top"]')
  const bottomRow = root.querySelector<HTMLElement>('[data-week-row="bottom"]')
  if (!track || !fill || !handle || !now || !topRow || !bottomRow) return

  if (daysBar) {
    daysBar.innerHTML = DAYS.map((d) => `<span>${d}</span>`).join('')
  }

  function buildRow(host: HTMLElement, events: WeekEvent[]): HTMLElement[] {
    host.innerHTML = ''
    return events.map((ev) => {
      const el = document.createElement('article')
      el.className = 'dept-week-event' + (ev.tone ? ` is-${ev.tone}` : '')
      const t = document.createElement('time')
      t.textContent = stamp(ev.at)
      const p = document.createElement('p')
      p.textContent = ev.text
      el.append(t, p)
      host.append(el)
      return el
    })
  }

  const topEls = buildRow(topRow, TOP)
  const bottomEls = buildRow(bottomRow, BOTTOM)

  // event ticks on the rail, at their true position in the week
  for (const [events, row] of [[TOP, 'top'], [BOTTOM, 'bottom']] as const) {
    for (const ev of events) {
      const tick = document.createElement('span')
      tick.className = 'dept-week-tick'
      tick.dataset.row = row
      tick.dataset.at = String(ev.at)
      tick.style.left = `${(ev.at / MAX) * 100}%`
      track!.append(tick)
    }
  }
  const ticks = Array.from(track.querySelectorAll<HTMLElement>('.dept-week-tick'))

  let value = 0
  /** cached bubble width, recomputed whenever its label changes */
  let bubbleW = 0
  /** true once the intro sweep has run or the user has taken over */
  let swept = false

  function paintRow(els: HTMLElement[], events: WeekEvent[]) {
    let lastPassed = -1
    events.forEach((ev, i) => { if (value >= ev.at) lastPassed = i })
    els.forEach((el, i) => {
      el.classList.toggle('is-past', i < lastPassed)
      el.classList.toggle('is-now', i === lastPassed)
    })
  }

  function paint() {
    const pct = (value / MAX) * 100
    fill!.style.width = `${pct}%`
    handle!.style.left = `${pct}%`
    const label = spoken(value)
    if (now!.textContent !== label) {
      now!.textContent = label
      bubbleW = 0
    }
    // the bubble rides the handle, held off the ends so it stays inside the card
    const trackW = track!.clientWidth
    if (!bubbleW) bubbleW = now!.offsetWidth
    const half = bubbleW / 2
    const x = trackW > bubbleW
      ? Math.min(Math.max((pct / 100) * trackW, half), trackW - half)
      : trackW / 2
    now!.style.left = `${x}px`
    track!.setAttribute('aria-valuenow', String(Math.round(value)))
    track!.setAttribute('aria-valuetext', label)
    paintRow(topEls, TOP)
    paintRow(bottomEls, BOTTOM)
    for (const tick of ticks) {
      tick.classList.toggle('is-past', value >= Number(tick.dataset.at))
    }
  }

  function set(next: number) {
    value = Math.max(0, Math.min(MAX, next))
    paint()
  }

  /* ---- pointer ---- */

  let dragging = false

  function fromClientX(clientX: number) {
    const rect = track!.getBoundingClientRect()
    const p = rect.width ? (clientX - rect.left) / rect.width : 0
    set(Math.max(0, Math.min(1, p)) * MAX)
  }

  track.addEventListener('pointerdown', (e) => {
    dragging = true
    swept = true // a deliberate grab cancels the intro sweep
    track!.setPointerCapture(e.pointerId)
    fromClientX(e.clientX)
  })
  track.addEventListener('pointermove', (e) => {
    if (dragging) fromClientX(e.clientX)
  })
  const endDrag = (e: PointerEvent) => {
    if (!dragging) return
    dragging = false
    if (track!.hasPointerCapture(e.pointerId)) track!.releasePointerCapture(e.pointerId)
  }
  track.addEventListener('pointerup', endDrag)
  track.addEventListener('pointercancel', endDrag)

  /* ---- keyboard ---- */

  track.addEventListener('keydown', (e) => {
    const big = e.shiftKey ? DAY : 60
    let handled = true
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp': set(value + big); break
      case 'ArrowLeft':
      case 'ArrowDown': set(value - big); break
      case 'PageUp': set(value + DAY); break
      case 'PageDown': set(value - DAY); break
      case 'Home': set(0); break
      case 'End': set(MAX); break
      default: handled = false
    }
    if (handled) {
      swept = true
      e.preventDefault()
    }
  })

  /* ---- intro sweep, so the section never reads as empty ---- */

  set(0)

  if (reduced) {
    swept = true
    set(MAX)
    return
  }

  const io = new IntersectionObserver((entries) => {
    if (!entries.some((en) => en.isIntersecting) || swept) return
    swept = true
    io.disconnect()
    const start = performance.now()
    const DURATION = 3600
    const step = (t: number) => {
      if (dragging) return
      const p = Math.min(1, (t - start) / DURATION)
      set(p * MAX)
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, { threshold: 0.35 })
  io.observe(root)
}
