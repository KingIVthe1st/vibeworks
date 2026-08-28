/**
 * The Floor.
 *
 * A stylised department floor seen from above at night, drawn on a 2D canvas.
 * A warm lamp hangs over the top centre. The floor is divided into three zones,
 * the front door, the hands and the office, and each play staffs those zones
 * with agents. Rings say who is working, who needs a person and who is done.
 *
 * No dependencies. Everything below is plain canvas 2D and a hand-rolled clock,
 * so the section stays cheap enough to leave running in a hero.
 */

type State = 'rest' | 'work' | 'need' | 'done'

/** front door, the hands, the office */
type ZoneId = 0 | 1 | 2

const ZONE_NAMES = ['Front door', 'The hands', 'The office'] as const

interface Role {
  label: string
  /** two-letter monogram inside the disc */
  mono: string
  zone: ZoneId
}

export interface FeedLine {
  /** empty on the line that asks for a tap */
  time: string
  text: string
  tone?: 'need' | 'done'
}

interface Play {
  id: string
  roles: Role[]
  feed: FeedLine[]
  report: string[]
}

interface Node {
  label: string
  mono: string
  zone: ZoneId
  x: number
  y: number
  r: number
  state: State
  /** 0 to 1, the lights-on stagger */
  lit: number
  /** 0 to 1, the re-staffing cross-fade */
  alpha: number
}

const WATCHER: Role = { label: 'watcher', mono: 'WA', zone: 2 }

const PLAYS: Play[] = [
  {
    id: 'lead',
    roles: [
      { label: 'intake', mono: 'IN', zone: 0 },
      { label: 'qualifier', mono: 'QU', zone: 0 },
      { label: 'scheduler', mono: 'SC', zone: 1 },
      { label: 'follow-up', mono: 'FU', zone: 1 },
      { label: 'reporter', mono: 'RP', zone: 2 },
    ],
    feed: [
      { time: '9:04pm', text: 'Intake logged the lead' },
      { time: '9:04pm', text: 'Qualifier scored it: fits' },
      { time: '9:05pm', text: 'Scheduler proposed Tue 10am, Wed 2pm' },
      { time: '9:05pm', text: 'Follow-up drafted the reply' },
      { time: '9:06pm', text: 'Reporter filed it to your thread' },
      { time: '', text: 'needs you: 1 tap', tone: 'need' },
      { time: '9:07pm', text: 'Done. You tapped once.', tone: 'done' },
    ],
    report: ['Lead captured 9:04pm', 'Qualified: fits', 'Reply drafted, 2 times proposed'],
  },
  {
    id: 'order',
    roles: [
      { label: 'intake', mono: 'IN', zone: 0 },
      { label: 'lookup', mono: 'LK', zone: 1 },
      { label: 'responder', mono: 'RS', zone: 1 },
      { label: 'reporter', mono: 'RP', zone: 2 },
    ],
    feed: [
      { time: '8:41am', text: 'Intake read the message' },
      { time: '8:41am', text: 'Lookup found the order: shipped Tuesday' },
      { time: '8:42am', text: 'Responder wrote the reply with tracking' },
      { time: '8:42am', text: 'Reporter filed it to your thread' },
      { time: '', text: 'needs you: 1 tap', tone: 'need' },
      { time: '8:43am', text: 'Done. You tapped once.', tone: 'done' },
    ],
    report: ['Order found, shipped Tuesday', 'Tracking pulled and checked', 'Reply drafted, one line to approve'],
  },
  {
    id: 'launch',
    roles: [
      { label: 'brief', mono: 'BR', zone: 0 },
      { label: 'copy', mono: 'CP', zone: 1 },
      { label: 'page', mono: 'PG', zone: 1 },
      { label: 'scheduler', mono: 'SC', zone: 1 },
      { label: 'reporter', mono: 'RP', zone: 2 },
    ],
    feed: [
      { time: '10:15am', text: 'Brief pulled the product details' },
      { time: '10:16am', text: 'Copy wrote the page and the emails' },
      { time: '10:18am', text: 'Page built it and staged it' },
      { time: '10:19am', text: 'Scheduler queued the send for Thursday' },
      { time: '10:20am', text: 'Reporter filed it to your thread' },
      { time: '', text: 'needs you: 1 tap', tone: 'need' },
      { time: '10:22am', text: 'Done. You tapped once.', tone: 'done' },
    ],
    report: ['Launch page built and staged', 'Email and SMS written', 'Waiting on your yes to publish'],
  },
  {
    id: 'invoices',
    roles: [
      { label: 'intake', mono: 'IN', zone: 0 },
      { label: 'matcher', mono: 'MT', zone: 0 },
      { label: 'reminder', mono: 'RM', zone: 1 },
      { label: 'ledger', mono: 'LG', zone: 1 },
      { label: 'reporter', mono: 'RP', zone: 2 },
    ],
    feed: [
      { time: '4:30pm', text: 'Intake pulled 17 invoices' },
      { time: '4:31pm', text: 'Matcher tied 13 to payments' },
      { time: '4:32pm', text: 'Reminder drafted 4 nudges' },
      { time: '4:33pm', text: 'Ledger posted them to the books' },
      { time: '4:34pm', text: 'Reporter filed it to your thread' },
      { time: '', text: 'needs you: 1 tap', tone: 'need' },
      { time: '4:36pm', text: 'Done. You tapped once.', tone: 'done' },
    ],
    report: ['17 invoices matched to payments', '4 reminders drafted', 'One account needs your call'],
  },
]

const COLOR = {
  rest: 'rgba(244, 242, 255, .30)',
  work: '#7c5cff',
  need: '#e8b34b',
  done: '#3ddc84',
  bone: '#f4f2ff',
  mute: '#aeb4c2',
  disc: '#151027',
  grid: 'rgba(244, 242, 255, .045)',
  zoneFill: 'rgba(244, 242, 255, .022)',
  zoneLine: 'rgba(244, 242, 255, .075)',
}

/* timing, in seconds */
const T_RESTAFF_OUT = 0.22
const T_RESTAFF = 0.4
const T_STEP = 0.62
const T_NEED_HOLD = 1.3
const T_AUTO_ADVANCE = 9.4
const T_FEED_NEED_OFFSET = 0.28

const expo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v)

/** Cubic bezier point, used for the travelling dot and the drawn segment. */
function bez(
  t: number,
  x0: number, y0: number,
  x1: number, y1: number,
  x2: number, y2: number,
  x3: number, y3: number,
): [number, number] {
  const u = 1 - t
  const a = u * u * u
  const b = 3 * u * u * t
  const c = 3 * u * t * t
  const d = t * t * t
  return [a * x0 + b * x1 + c * x2 + d * x3, a * y0 + b * y1 + c * y2 + d * y3]
}

/** Control points for the link between two nodes: bow along the dominant axis. */
function controls(ax: number, ay: number, bx: number, by: number): [number, number, number, number] {
  const dx = bx - ax
  const dy = by - ay
  if (Math.abs(dx) >= Math.abs(dy)) {
    return [ax + dx * 0.45, ay, bx - dx * 0.45, by]
  }
  return [ax, ay + dy * 0.45, bx, by - dy * 0.45]
}

export interface FloorCallbacks {
  onReport(lines: string[] | null): void
  /** null clears the feed; otherwise the line is pushed on top */
  onFeed(line: FeedLine | null): void
}

export interface FloorHandle {
  select(id: string, byUser: boolean): void
  playIds(): string[]
  /** Lets the chip group follow the autoplay loop. */
  onAutoSelect(fn: (id: string) => void): void
}

export function initFloor(
  root: HTMLElement,
  canvas: HTMLCanvasElement,
  cb: FloorCallbacks,
  reduced: boolean,
): FloorHandle {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return { select: () => {}, playIds: () => PLAYS.map((p) => p.id), onAutoSelect: () => {} }
  }

  let w = 0
  let h = 0
  let dpr = 1
  let narrow = false

  let current: Node[] = []
  let outgoing: Node[] = []
  let youNode: Node | null = null
  let watcherNode: Node | null = null

  /** zone boxes, recomputed on layout */
  let zoneBox: { x: number; y: number; w: number; h: number }[] = []
  let ringR = 26
  let lampRad = 200

  let playIndex = 0
  /** seconds since the current play started */
  let playT = 0
  /** seconds since the section booted, drives lights-on */
  let bootT = 0
  let lampOn = reduced ? 1 : 0
  let brightness = reduced ? 1 : 0.12
  let started = false
  let userTook = false
  let reportShown = false
  let feedShown = 0
  let firstStaff = true

  let visible = true
  let lastFrame = 0
  let raf = 0

  /* ---------------------------------------------------------------- layout */

  function layout() {
    const rect = canvas.getBoundingClientRect()
    w = Math.max(1, Math.round(rect.width))
    h = Math.max(1, Math.round(rect.height))
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    narrow = w < 560
    lampRad = Math.max(w * 0.55, 240)
    placeAll()
  }

  /** The three zone rectangles plus the right-hand gutter the owner sits in. */
  function zones() {
    const padX = narrow ? 12 : 18
    const gutter = narrow ? 64 : 112
    const top = narrow ? 58 : 48
    // the phone canvas is cut to the graph and the slip flows under it, so it
    // only pads; taller canvases keep room for the feed and slip they overlay
    const bottomReserve = h < 420 ? 24 : h < 600 ? 118 : 152
    const gap = narrow ? 10 : 14
    const boxW = Math.max(120, w - padX - gutter)
    const region = Math.max(150, h - bottomReserve - top)
    const boxH = (region - gap * 2) / 3
    zoneBox = [0, 1, 2].map((k) => ({ x: padX, y: top + k * (boxH + gap), w: boxW, h: boxH }))
    return { padX, gutter, labelPad: narrow ? 21 : 25 }
  }

  function placeNodes(nodes: Node[], labelPad: number) {
    if (!nodes.length) return
    for (let k = 0; k < 3; k++) {
      const box = zoneBox[k]
      const inZone = nodes.filter((n) => n.zone === k)
      const n = inZone.length
      if (!n || !box) continue
      const slot = box.w / n
      const capH = (box.h - labelPad - (narrow ? 30 : 36)) / 2
      const capW = slot * 0.33
      const r = clamp(Math.min(capH, capW), narrow ? 13 : 17, narrow ? 20 : 28)
      const contentH = r * 2 + (narrow ? 30 : 36)
      const cy = box.y + labelPad + (box.h - labelPad - contentH) / 2 + r
      inZone.forEach((node, i) => {
        node.x = box.x + slot * (i + 0.5)
        node.y = cy
        node.r = r
      })
      if (k === 0) ringR = r
    }
  }

  function placeAll() {
    const { gutter, labelPad } = zones()
    placeNodes(current, labelPad)
    placeNodes(outgoing, labelPad)
    if (!youNode) {
      youNode = {
        label: 'you', mono: '', zone: 2, x: 0, y: 0, r: 0,
        state: 'rest', lit: reduced ? 1 : 0, alpha: 1,
      }
    }
    if (!watcherNode) {
      watcherNode = {
        label: WATCHER.label, mono: WATCHER.mono, zone: 2, x: 0, y: 0, r: 0,
        state: 'rest', lit: reduced ? 1 : 0, alpha: 1,
      }
    }
    // the watcher shares the office with the reporter, so the office slots are
    // recut to fit it alongside whatever the play staffed there
    const office = zoneBox[2]
    const officeAgents = current.filter((n) => n.zone === 2)
    const r = officeAgents[0]?.r ?? ringR
    if (office) {
      const slots = officeAgents.length + 1
      const slot = office.w / slots
      officeAgents.forEach((node, i) => { node.x = office.x + slot * (i + 0.5) })
      const cy = officeAgents[0]?.y ?? office.y + office.h / 2
      watcherNode.x = office.x + slot * (slots - 0.5)
      // dropped below the line the reporter draws out to you, so the watcher
      // never reads as a step in the chain
      watcherNode.y = cy + r * 0.9
      watcherNode.r = r * 0.78
      youNode.x = w - gutter / 2
      youNode.y = cy
      youNode.r = r * 0.72
    }
  }

  /* ----------------------------------------------------------------- plays */

  function staff(index: number) {
    const play = PLAYS[index]
    outgoing = firstStaff ? [] : current.map((n) => ({ ...n }))
    current = play.roles.map((role) => ({
      label: role.label,
      mono: role.mono,
      zone: role.zone,
      x: 0,
      y: 0,
      r: 26,
      state: 'rest' as State,
      lit: reduced || !started ? 0 : 1,
      alpha: firstStaff ? 1 : 0,
    }))
    if (reduced) current.forEach((n) => { n.lit = 1; n.alpha = 1 })
    firstStaff = false
    playIndex = index
    playT = 0
    reportShown = false
    feedShown = 0
    cb.onReport(null)
    cb.onFeed(null)
    placeAll()
    if (reduced) {
      // No motion: land straight on the finished state.
      current.forEach((n) => { n.state = 'done' })
      reportShown = true
      feedShown = play.feed.length
      cb.onReport(play.report)
      play.feed.slice(-4).forEach((line) => cb.onFeed(line))
    }
  }

  /** Where the play is right now, derived from playT. Pure, so it stays honest. */
  function phase() {
    const n = current.length
    const runStart = T_RESTAFF
    const needAt = runStart + n * T_STEP
    const doneAt = needAt + T_NEED_HOLD
    return { n, runStart, needAt, doneAt }
  }

  function feedAt(i: number) {
    const { n, runStart, needAt, doneAt } = phase()
    if (i < n) return runStart + (i + 1) * T_STEP
    if (i === n) return needAt + T_FEED_NEED_OFFSET
    return doneAt
  }

  function advance(dt: number) {
    if (reduced) return
    playT += dt
    const { n, needAt, doneAt, runStart } = phase()

    // re-staffing cross-fade
    const outA = 1 - clamp01(playT / T_RESTAFF_OUT)
    outgoing.forEach((node) => { node.alpha = outA })
    if (outA <= 0) outgoing = []
    current.forEach((node, i) => {
      const at = T_RESTAFF_OUT + i * 0.05
      node.alpha = clamp01((playT - at) / 0.24)
      if (started) node.lit = 1
    })

    // step states
    current.forEach((node, i) => {
      const s = runStart + i * T_STEP
      const e = s + T_STEP
      if (playT < s) node.state = 'rest'
      else if (playT < e) node.state = 'work'
      else if (i === n - 1) node.state = playT < doneAt ? 'need' : 'done'
      else node.state = 'done'
    })

    const play = PLAYS[playIndex]
    while (feedShown < play.feed.length && playT >= feedAt(feedShown)) {
      cb.onFeed(play.feed[feedShown])
      feedShown += 1
    }

    if (playT >= doneAt && !reportShown) {
      reportShown = true
      cb.onReport(play.report)
    }

    if (!userTook && playT >= T_AUTO_ADVANCE) {
      const next = (playIndex + 1) % PLAYS.length
      staff(next)
      syncChips(PLAYS[next].id)
    }
    void needAt
  }

  let syncChips: (id: string) => void = () => {}

  /* ----------------------------------------------------------------- paint */

  /** 0 to 1: how far inside the lamp pool a point sits. */
  function warmAt(x: number, y: number) {
    const dx = x - w * 0.5
    const dy = y + h * 0.02
    const d = Math.sqrt(dx * dx + dy * dy)
    return clamp01(1 - d / (lampRad * 0.9))
  }

  function grid() {
    ctx!.save()
    ctx!.strokeStyle = COLOR.grid
    ctx!.lineWidth = 1
    const step = narrow ? 34 : 46
    ctx!.beginPath()
    for (let x = (w % step) / 2; x < w; x += step) {
      ctx!.moveTo(Math.round(x) + 0.5, 0)
      ctx!.lineTo(Math.round(x) + 0.5, h)
    }
    for (let y = (h % step) / 2; y < h; y += step) {
      ctx!.moveTo(0, Math.round(y) + 0.5)
      ctx!.lineTo(w, Math.round(y) + 0.5)
    }
    ctx!.stroke()
    ctx!.restore()
  }

  function lamp() {
    if (lampOn <= 0) return
    ctx!.save()
    ctx!.globalCompositeOperation = 'lighter'
    const cx = w * 0.5
    const cy = -h * 0.02
    const g = ctx!.createRadialGradient(cx, cy, lampRad * 0.04, cx, cy, lampRad)
    g.addColorStop(0, `rgba(232, 179, 75, ${0.45 * lampOn})`)
    g.addColorStop(0.12, `rgba(232, 179, 75, ${0.4 * lampOn})`)
    g.addColorStop(0.3, `rgba(232, 179, 75, ${0.32 * lampOn})`)
    g.addColorStop(0.55, `rgba(232, 179, 75, ${0.14 * lampOn})`)
    g.addColorStop(0.78, `rgba(160, 120, 200, ${0.05 * lampOn})`)
    g.addColorStop(1, 'rgba(232, 179, 75, 0)')
    ctx!.fillStyle = g
    ctx!.fillRect(0, 0, w, h)
    ctx!.restore()
  }

  function roundRect(x: number, y: number, rw: number, rh: number, rad: number) {
    ctx!.beginPath()
    const k = Math.min(rad, rw / 2, rh / 2)
    ctx!.moveTo(x + k, y)
    ctx!.lineTo(x + rw - k, y)
    ctx!.quadraticCurveTo(x + rw, y, x + rw, y + k)
    ctx!.lineTo(x + rw, y + rh - k)
    ctx!.quadraticCurveTo(x + rw, y + rh, x + rw - k, y + rh)
    ctx!.lineTo(x + k, y + rh)
    ctx!.quadraticCurveTo(x, y + rh, x, y + rh - k)
    ctx!.lineTo(x, y + k)
    ctx!.quadraticCurveTo(x, y, x + k, y)
    ctx!.closePath()
  }

  function zoneBoxes() {
    ctx!.save()
    ctx!.globalAlpha = brightness
    zoneBox.forEach((box, k) => {
      roundRect(box.x, box.y, box.w, box.h, 16)
      ctx!.fillStyle = COLOR.zoneFill
      ctx!.fill()
      ctx!.lineWidth = 1
      ctx!.strokeStyle = COLOR.zoneLine
      ctx!.stroke()
      label(ZONE_NAMES[k], box.x + 13, box.y + (narrow ? 7 : 9), COLOR.mute, 0.7, narrow ? 8 : 9.5, 'left', '1.6px', true)
    })
    ctx!.restore()
  }

  /** Draws the resting hair line and the travelled violet segment behind the dot. */
  function edges(activeIndex: number, dotT: number, progress: number[]) {
    if (!youNode) return
    const chain: Node[] = [...current, youNode]
    ctx!.save()
    for (let i = 0; i < chain.length - 1; i++) {
      const a = chain[i]
      const b = chain[i + 1]
      const alpha = Math.min(a.alpha, b.alpha) * brightness
      if (alpha <= 0.01) continue
      const [c1x, c1y, c2x, c2y] = controls(a.x, a.y, b.x, b.y)
      ctx!.lineWidth = 1.5
      ctx!.beginPath()
      ctx!.moveTo(a.x, a.y)
      ctx!.bezierCurveTo(c1x, c1y, c2x, c2y, b.x, b.y)
      ctx!.strokeStyle = `rgba(244, 242, 255, ${0.1 * alpha})`
      ctx!.stroke()

      const p = progress[i] ?? 0
      if (p > 0.001) {
        const steps = 26
        const last = Math.max(1, Math.ceil(steps * p))
        ctx!.beginPath()
        ctx!.moveTo(a.x, a.y)
        for (let s = 1; s <= last; s++) {
          const t = Math.min(p, s / steps)
          const [px, py] = bez(t, a.x, a.y, c1x, c1y, c2x, c2y, b.x, b.y)
          ctx!.lineTo(px, py)
        }
        ctx!.lineWidth = 2
        ctx!.lineCap = 'round'
        ctx!.strokeStyle = `rgba(124, 92, 255, ${0.85 * alpha})`
        ctx!.stroke()
      }
    }
    // travelling dot
    if (activeIndex >= 0 && activeIndex < chain.length - 1 && dotT >= 0) {
      const a = chain[activeIndex]
      const b = chain[activeIndex + 1]
      const [c1x, c1y, c2x, c2y] = controls(a.x, a.y, b.x, b.y)
      const [px, py] = bez(clamp01(dotT), a.x, a.y, c1x, c1y, c2x, c2y, b.x, b.y)
      const toYou = activeIndex === current.length - 1
      const col = toYou ? COLOR.need : COLOR.work
      ctx!.beginPath()
      ctx!.arc(px, py, 3.4, 0, Math.PI * 2)
      ctx!.fillStyle = col
      ctx!.shadowColor = col
      ctx!.shadowBlur = 12 * brightness
      ctx!.globalAlpha = brightness
      ctx!.fill()
    }
    ctx!.restore()
  }

  function label(
    text: string,
    x: number,
    y: number,
    color: string,
    alpha: number,
    size: number,
    align: CanvasTextAlign = 'center',
    spacing = '1.6px',
    backing = false,
  ) {
    ctx!.save()
    ctx!.globalAlpha = alpha
    ctx!.fillStyle = color
    ctx!.font = `${size}px "IBM Plex Mono", ui-monospace, monospace`
    ctx!.textAlign = align
    ctx!.textBaseline = 'top'
    try {
      ;(ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = spacing
    } catch {
      /* letterSpacing is not everywhere yet; the label still reads without it */
    }
    const up = text.toUpperCase()
    if (backing) {
      // a 1px darker offset keeps the label legible where the lamp pools
      ctx!.save()
      ctx!.globalAlpha = alpha * 0.9
      ctx!.fillStyle = 'rgba(7, 5, 18, .85)'
      ctx!.fillText(up, x + 1, y + 1)
      ctx!.restore()
    }
    ctx!.fillText(up, x, y)
    ctx!.restore()
  }

  function disc(x: number, y: number, r: number, mono: string, a: number) {
    ctx!.beginPath()
    ctx!.arc(x, y, r - 1.5, 0, Math.PI * 2)
    ctx!.fillStyle = COLOR.disc
    ctx!.fill()
    if (!mono) return
    ctx!.save()
    ctx!.globalAlpha = a * 0.6
    ctx!.fillStyle = COLOR.bone
    ctx!.font = `${Math.max(8, Math.round(r * 0.62))}px "IBM Plex Mono", ui-monospace, monospace`
    ctx!.textAlign = 'center'
    ctx!.textBaseline = 'middle'
    try {
      ;(ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '0.5px'
    } catch { /* fine without */ }
    ctx!.fillText(mono, x, y + 0.5)
    ctx!.restore()
  }

  function ring(node: Node, t: number) {
    const a = node.alpha * node.lit * brightness
    if (a <= 0.01) return
    const { r, x, y } = node
    const warm = warmAt(x, y)
    ctx!.save()
    ctx!.globalAlpha = a
    disc(x, y, r, node.mono, a)
    ctx!.lineWidth = 2

    if (node.state === 'done') {
      ctx!.beginPath()
      ctx!.arc(x, y, r - 1.5, 0, Math.PI * 2)
      ctx!.fillStyle = 'rgba(61, 220, 132, .3)'
      ctx!.fill()
      ctx!.beginPath()
      ctx!.arc(x, y, r, 0, Math.PI * 2)
      ctx!.strokeStyle = COLOR.done
      ctx!.stroke()
    } else if (node.state === 'work') {
      ctx!.beginPath()
      ctx!.arc(x, y, r, 0, Math.PI * 2)
      ctx!.strokeStyle = 'rgba(124, 92, 255, .55)'
      ctx!.stroke()
      ctx!.beginPath()
      ctx!.arc(x, y, r + 5, 0, Math.PI * 2)
      ctx!.setLineDash([r * 0.8, r * 0.55])
      ctx!.lineDashOffset = -t * 46
      ctx!.strokeStyle = COLOR.work
      ctx!.shadowColor = COLOR.work
      ctx!.shadowBlur = 10
      ctx!.stroke()
      ctx!.setLineDash([])
    } else if (node.state === 'need') {
      const pulse = reduced ? 0.5 : (Math.sin(t * 3.4) + 1) / 2
      ctx!.beginPath()
      ctx!.arc(x, y, r, 0, Math.PI * 2)
      ctx!.strokeStyle = COLOR.need
      ctx!.shadowColor = COLOR.need
      ctx!.shadowBlur = 24
      ctx!.globalAlpha = a * (0.72 + 0.28 * pulse)
      ctx!.stroke()
      ctx!.shadowBlur = 0
      ctx!.globalAlpha = a * (0.18 + 0.24 * pulse)
      ctx!.beginPath()
      ctx!.arc(x, y, r + 6 + 4 * pulse, 0, Math.PI * 2)
      ctx!.lineWidth = 1
      ctx!.strokeStyle = COLOR.need
      ctx!.stroke()
    } else {
      ctx!.beginPath()
      ctx!.arc(x, y, r, 0, Math.PI * 2)
      ctx!.strokeStyle = warm > 0.02
        ? `rgba(${Math.round(244 - 8 * warm)}, ${Math.round(242 - 70 * warm)}, ${Math.round(255 - 200 * warm)}, ${0.3 + 0.34 * warm})`
        : COLOR.rest
      ctx!.stroke()
    }
    ctx!.restore()

    const size = narrow ? 8 : 9
    const col = node.state === 'rest' ? COLOR.mute : COLOR.bone
    label(node.label, x, y + r + (narrow ? 8 : 10), col, a, size)
    if (node.state === 'work') {
      label('working', x, y + r + (narrow ? 19 : 22), COLOR.work, a * 0.95, narrow ? 7.5 : 8.5)
    }
  }

  function youDisc(t: number, needing: boolean) {
    if (!youNode) return
    const a = youNode.lit * brightness
    if (a <= 0.01) return
    const { x, y, r } = youNode
    ctx!.save()
    ctx!.globalAlpha = a
    ctx!.beginPath()
    ctx!.arc(x, y, r, 0, Math.PI * 2)
    ctx!.fillStyle = COLOR.bone
    ctx!.fill()
    if (needing) {
      const pulse = reduced ? 0.5 : (Math.sin(t * 3.4) + 1) / 2
      ctx!.globalAlpha = a * (0.3 + 0.35 * pulse)
      ctx!.beginPath()
      ctx!.arc(x, y, r + 7 + 5 * pulse, 0, Math.PI * 2)
      ctx!.lineWidth = 1.5
      ctx!.strokeStyle = COLOR.need
      ctx!.shadowColor = COLOR.need
      ctx!.shadowBlur = 24
      ctx!.stroke()
    }
    ctx!.restore()
    label('you', x, y + r + (narrow ? 8 : 10), COLOR.bone, a, narrow ? 8 : 9)
    if (needing) {
      label('1 tap', x, y + r + (narrow ? 19 : 22), COLOR.need, a, narrow ? 7.5 : 8.5)
    }
  }

  function watcher() {
    if (!watcherNode) return
    const a = watcherNode.lit * brightness
    if (a <= 0.01) return
    const { x, y, r } = watcherNode
    ctx!.save()
    ctx!.globalAlpha = a * 0.92
    disc(x, y, r, watcherNode.mono, a)
    ctx!.beginPath()
    ctx!.arc(x, y, r, 0, Math.PI * 2)
    ctx!.lineWidth = 2
    ctx!.strokeStyle = COLOR.rest
    ctx!.stroke()
    ctx!.restore()
    label(watcherNode.label, x, y + r + (narrow ? 8 : 10), COLOR.mute, a, narrow ? 8 : 9)
  }

  function statusLine() {
    const working = current.filter((n) => n.state === 'work').length
    const need = current.filter((n) => n.state === 'need').length
    const done = current.filter((n) => n.state === 'done').length
    const text = `${working} working · ${need} need you · ${done} done`
    label(
      text, w - (narrow ? 12 : 18), narrow ? 34 : 17,
      COLOR.mute, brightness * 0.85, narrow ? 8 : 9.5, 'right', '1.4px', true,
    )
  }

  function draw() {
    ctx!.clearRect(0, 0, w, h)
    ctx!.fillStyle = '#0e0a1c'
    ctx!.fillRect(0, 0, w, h)

    ctx!.save()
    ctx!.globalAlpha = brightness
    grid()
    ctx!.restore()
    lamp()
    zoneBoxes()

    const { n, runStart, needAt, doneAt } = phase()
    let activeIndex = -1
    let dotT = -1
    const progress: number[] = []
    for (let i = 0; i < n; i++) {
      progress[i] = reduced ? 1 : clamp01((playT - (runStart + i * T_STEP)) / T_STEP)
    }
    if (!reduced && playT >= runStart) {
      const idx = Math.floor((playT - runStart) / T_STEP)
      if (idx < n) {
        activeIndex = idx
        dotT = ((playT - runStart) % T_STEP) / T_STEP
      }
    }
    const needing = !reduced && playT >= needAt && playT < doneAt

    edges(activeIndex, dotT, progress)
    watcher()
    outgoing.forEach((node) => ring(node, bootT))
    current.forEach((node) => ring(node, bootT))
    youDisc(bootT, needing)
    statusLine()
  }

  /* ------------------------------------------------------------------ loop */

  function tick(now: number) {
    raf = requestAnimationFrame(tick)
    if (document.hidden) { lastFrame = now; return }
    const interval = visible ? 0 : 1000 / 30
    if (now - lastFrame < interval) return
    const dt = Math.min((now - lastFrame) / 1000, 0.05)
    lastFrame = now
    bootT += dt

    if (!reduced) {
      // lights on
      const lampStart = 0.35
      const p = clamp01((bootT - lampStart) / 0.7)
      lampOn = expo(p)
      brightness = 0.12 + 0.88 * expo(p)
      current.forEach((node, i) => {
        const at = lampStart + 0.25 + i * 0.07
        node.lit = clamp01(expo(clamp01((bootT - at) / 0.32)))
      })
      if (youNode) youNode.lit = clamp01(expo(clamp01((bootT - lampStart - 0.25) / 0.4)))
      if (watcherNode) {
        watcherNode.lit = clamp01(expo(clamp01((bootT - lampStart - 0.25 - current.length * 0.07) / 0.32)))
      }
      if (!started && bootT >= lampStart + 0.72) {
        started = true
        playT = T_RESTAFF - 0.001
      }
      if (started) advance(dt)
    }

    draw()
  }

  /* ------------------------------------------------------------------ init */

  function select(id: string, byUser: boolean) {
    const index = PLAYS.findIndex((p) => p.id === id)
    if (index < 0 || (index === playIndex && !byUser)) return
    if (byUser) userTook = true
    staff(index)
    if (started || reduced) {
      // a user pick should run, not sit through the boot pause
      playT = 0
    }
    if (!reduced) draw()
  }

  staff(0)
  layout()

  const ro = new ResizeObserver(() => { layout(); draw() })
  ro.observe(canvas)

  const io = new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting)
  }, { threshold: 0 })
  io.observe(root)

  if (reduced) {
    void Promise.resolve(document.fonts?.ready).then(() => { layout(); draw() })
    draw()
  } else {
    lastFrame = performance.now()
    raf = requestAnimationFrame(tick)
    void Promise.resolve(document.fonts?.ready).then(() => { layout() })
  }

  window.addEventListener('pagehide', () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect() })

  return {
    select,
    playIds: () => PLAYS.map((p) => p.id),
    onAutoSelect: (fn) => { syncChips = fn },
  }
}
