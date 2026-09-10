/* The timing model behind "The Call".
   Pure functions, no DOM, so the schedule can be tested on its own.
   Timestamps come from the markup, which is the single source of the copy. */

export interface CallLine {
  /** Seconds into the call at which the line appears. */
  at: number
  /** Word count of the line, used to estimate how long it is spoken for. */
  words: number
}

/** "0:07" -> 7. Returns NaN for anything that is not m:ss. */
export function parseStamp(stamp: string): number {
  const parts = stamp.trim().split(':')
  if (parts.length !== 2) return Number.NaN

  const minutes = Number(parts[0])
  const seconds = Number(parts[1])
  if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) return Number.NaN

  return minutes * 60 + seconds
}

const LEAD_IN = 0.6
const PER_WORD = 0.34
const GAP = 0.25
const MIN_SPEECH = 0.5

/** The second at which a line stops being spoken. Never runs into the next line. */
export function speechEnd(lines: readonly CallLine[], index: number): number {
  const line = lines[index]
  if (!line) return Number.NaN

  const spoken = line.at + LEAD_IN + line.words * PER_WORD
  const next = lines[index + 1]
  if (!next) return spoken

  return Math.max(line.at + MIN_SPEECH, Math.min(spoken, next.at - GAP))
}

/** How many lines have appeared by second `t`. */
export function shownCount(lines: readonly CallLine[], t: number): number {
  let count = 0
  for (const line of lines) {
    if (t + 1e-6 < line.at) break
    count += 1
  }
  return count
}

/** Index of the line being spoken at second `t`, or -1 between lines. */
export function speakingIndex(lines: readonly CallLine[], t: number): number {
  const shown = shownCount(lines, t)
  if (shown === 0) return -1

  const index = shown - 1
  return t < speechEnd(lines, index) ? index : -1
}

/** Total run time: the last line finishes, then the outcome lands. */
export function callDuration(lines: readonly CallLine[], tail = 2): number {
  if (lines.length === 0) return 0
  return speechEnd(lines, lines.length - 1) + tail
}

/** m:ss for the call clock. */
export function formatClock(seconds: number): string {
  const whole = Math.max(0, Math.floor(seconds))
  const minutes = Math.floor(whole / 60)
  return `${minutes}:${String(whole % 60).padStart(2, '0')}`
}
