import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { formatDollars, meterPercent, meterScale, parseDollars, rankOpportunities, type MapRow } from '../src/consult/opportunity-map'

/* The example rows from the Opportunity Map on /consult, deliberately out of order. */
const ROWS: MapRow[] = [
  { workflow: 'Job photos filed and tagged to the customer', hours: 5, value: 6500 },
  { workflow: 'New hire onboarding checklist', hours: 3, value: 3100 },
  { workflow: 'After-hours calls answered and booked', hours: 14, value: 38400 },
  { workflow: 'Weekly owner report built automatically', hours: 4, value: 5200 },
  { workflow: 'Estimate follow-ups sent the same day', hours: 9, value: 21600 },
  { workflow: 'Invoice reminders and payment chasing', hours: 6, value: 9800 },
]

const RANKED = [
  'After-hours calls answered and booked',
  'Estimate follow-ups sent the same day',
  'Invoice reminders and payment chasing',
  'Job photos filed and tagged to the customer',
  'Weekly owner report built automatically',
  'New hire onboarding checklist',
]

describe('rankOpportunities', () => {
  it('ranks by annual value, highest first', () => {
    const { rows } = rankOpportunities(ROWS, 6000)
    expect(rows.map((row) => row.workflow)).toEqual(RANKED)
  })

  it('totals every line and prints the multiple as 14x', () => {
    const summary = rankOpportunities(ROWS, 6000)
    expect(summary.total).toBe(84600)
    expect(summary.ratio).toBe(14.1)
    expect(summary.multiple).toBe('14x')
  })

  it('totals well past ten times the fee', () => {
    expect(rankOpportunities(ROWS, 6000).total).toBeGreaterThanOrEqual(60000)
  })

  it('does not reorder or mutate the input', () => {
    const copy = ROWS.map((row) => ({ ...row }))
    rankOpportunities(ROWS, 6000)
    expect(ROWS).toEqual(copy)
  })

  it('breaks ties on hours, then on original order', () => {
    const tied: MapRow[] = [
      { workflow: 'a', hours: 2, value: 1000 },
      { workflow: 'b', hours: 5, value: 1000 },
      { workflow: 'c', hours: 2, value: 1000 },
    ]
    expect(rankOpportunities(tied, 100).rows.map((row) => row.workflow)).toEqual(['b', 'a', 'c'])
  })

  it('returns a zero ratio rather than Infinity for a zero fee', () => {
    const summary = rankOpportunities(ROWS, 0)
    expect(summary.ratio).toBe(0)
    expect(summary.multiple).toBe('0x')
  })
})

describe('the meter', () => {
  it('scales to the next $10,000 above the total', () => {
    expect(meterScale(84600)).toBe(90000)
    expect(meterScale(90000)).toBe(90000)
    expect(meterScale(0)).toBe(10000)
  })

  it('places the meter ticks and the fill', () => {
    expect(meterPercent(6000, 90000)).toBeCloseTo(6.6667, 3)
    expect(meterPercent(60000, 90000)).toBeCloseTo(66.6667, 3)
    expect(meterPercent(84600, 90000)).toBeCloseTo(94, 5)
    expect(meterPercent(120000, 90000)).toBe(100)
    expect(meterPercent(-5, 90000)).toBe(0)
  })
})

describe('dollar figures', () => {
  it('formats and parses whole dollars', () => {
    expect(formatDollars(38400)).toBe('$38,400')
    expect(formatDollars(0)).toBe('$0')
    expect(formatDollars(84599.6)).toBe('$84,600')
    expect(parseDollars('$38,400')).toBe(38400)
    expect(parseDollars(' $3,100 ')).toBe(3100)
    expect(Number.isNaN(parseDollars('about $3k'))).toBe(true)
  })
})

/* The markup is the no-JS and reduced-motion state, so it has to be the
   finished one: already ranked, and totalled to the same figures. */
describe('consult/index.html', () => {
  const html = readFileSync(resolve(__dirname, '../consult/index.html'), 'utf8')
  const rowBlocks = html.match(/<li class="cs-map-row"[\s\S]*?<\/li>/g) ?? []
  const markupRows: MapRow[] = rowBlocks.map((block) => ({
    workflow: /data-map-work>([^<]+)</.exec(block)?.[1] ?? '',
    hours: Number(/data-map-hours>([^<]+)</.exec(block)?.[1]),
    value: parseDollars(/data-map-value>([^<]+)</.exec(block)?.[1] ?? ''),
  }))

  it('ships the six rows already in ranked order', () => {
    expect(markupRows).toHaveLength(6)
    expect(markupRows.map((row) => row.workflow)).toEqual(RANKED)
    expect(rankOpportunities(markupRows, 6000).rows).toEqual(markupRows)
  })

  it('prints the same total and multiple the arithmetic gives', () => {
    const summary = rankOpportunities(markupRows, 6000)
    expect(/data-meter-total>([^<]+)</.exec(html)?.[1]).toBe(formatDollars(summary.total))
    expect(/data-meter-multiple>([^<]+)</.exec(html)?.[1]).toBe(summary.multiple)
  })

  it('opens every Calendly link in a new tab with rel="noopener"', () => {
    const links = html.match(/<a [^>]*calendly\.com[^>]*>/g) ?? []
    expect(links.length).toBeGreaterThanOrEqual(3)
    for (const link of links) {
      expect(link).toContain('target="_blank"')
      expect(link).toContain('rel="noopener"')
    }
  })
})
