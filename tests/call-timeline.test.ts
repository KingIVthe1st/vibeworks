import { describe, expect, it } from 'vitest'
import { callDuration, formatClock, parseStamp, shownCount, speakingIndex, speechEnd } from '../src/desk/call-timeline'

/* The Tour Desk call, as it is written in tour-desk/index.html. */
const tour = [
  { at: 1, words: 28 },
  { at: 7, words: 12 },
  { at: 12, words: 27 },
  { at: 20, words: 7 },
  { at: 24, words: 17 },
  { at: 29, words: 3 },
  { at: 34, words: 26 },
  { at: 41, words: 6 },
  { at: 44, words: 21 },
]

describe('parseStamp', () => {
  it('reads m:ss', () => {
    expect(parseStamp('0:07')).toBe(7)
    expect(parseStamp('1:04')).toBe(64)
  })

  it('rejects anything that is not m:ss', () => {
    expect(parseStamp('nope')).toBeNaN()
    expect(parseStamp('12')).toBeNaN()
  })
})

describe('shownCount', () => {
  it('starts empty and ends complete', () => {
    expect(shownCount(tour, 0)).toBe(0)
    expect(shownCount(tour, 0.99)).toBe(0)
    expect(shownCount(tour, 1)).toBe(1)
    expect(shownCount(tour, 999)).toBe(tour.length)
  })

  it('never goes backwards as the call runs', () => {
    let previous = 0
    for (let t = 0; t < 60; t += 0.25) {
      const count = shownCount(tour, t)
      expect(count).toBeGreaterThanOrEqual(previous)
      previous = count
    }
  })
})

describe('speechEnd', () => {
  it('stops a line before the next one starts', () => {
    for (let index = 0; index < tour.length - 1; index += 1) {
      expect(speechEnd(tour, index)).toBeLessThan(tour[index + 1].at)
      expect(speechEnd(tour, index)).toBeGreaterThan(tour[index].at)
    }
  })
})

describe('speakingIndex', () => {
  it('is the current line while it is spoken and -1 in the silence after it', () => {
    expect(speakingIndex(tour, 0.5)).toBe(-1)
    expect(speakingIndex(tour, 1.2)).toBe(0)
    expect(speakingIndex(tour, 6.9)).toBe(-1)
    expect(speakingIndex(tour, 7.4)).toBe(1)
  })

  it('only ever names a line that has already appeared', () => {
    for (let t = 0; t < 60; t += 0.1) {
      const index = speakingIndex(tour, t)
      if (index >= 0) expect(tour[index].at).toBeLessThanOrEqual(t + 1e-6)
    }
  })
})

describe('callDuration', () => {
  it('outlasts the final line', () => {
    expect(callDuration(tour)).toBeGreaterThan(speechEnd(tour, tour.length - 1))
    expect(callDuration([])).toBe(0)
  })
})

describe('formatClock', () => {
  it('pads the seconds', () => {
    expect(formatClock(0)).toBe('0:00')
    expect(formatClock(7.8)).toBe('0:07')
    expect(formatClock(64)).toBe('1:04')
    expect(formatClock(-3)).toBe('0:00')
  })
})
