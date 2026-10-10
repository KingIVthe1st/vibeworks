/* The arithmetic behind the Opportunity Map on /consult.
   Pure functions, no DOM, so the ranking and the meter can be tested on their own.
   The rows come from the markup, which is the single source of the copy. */

export interface MapRow {
  workflow: string
  /** Hours a week the workflow eats today. */
  hours: number
  /** Annual dollar value of handing it to AI. */
  value: number
}

export interface MapSummary {
  /** Rows ranked by annual value, highest first. */
  rows: MapRow[]
  /** Sum of every row's annual value. */
  total: number
  /** total / fee, to one decimal place. */
  ratio: number
  /** The whole multiple as printed on the page, e.g. "14x". */
  multiple: string
}

/** Highest annual value first; ties go to more hours, then to the original order. */
export function rankOpportunities(rows: readonly MapRow[], fee: number): MapSummary {
  const ranked = rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => b.row.value - a.row.value || b.row.hours - a.row.hours || a.index - b.index)
    .map(({ row }) => row)

  const total = rows.reduce((sum, row) => sum + row.value, 0)
  const ratio = fee > 0 ? Math.round((total / fee) * 10) / 10 : 0

  return { rows: ranked, total, ratio, multiple: `${Math.floor(ratio)}x` }
}

/** The meter's full scale: the total rounded up to the next $10,000. */
export function meterScale(total: number): number {
  if (!(total > 0)) return 10_000
  return Math.ceil(total / 10_000) * 10_000
}

/** Where a dollar figure sits on the meter, as a percentage of its width. */
export function meterPercent(value: number, scale: number): number {
  if (!(scale > 0)) return 0
  return Math.max(0, Math.min(100, (value / scale) * 100))
}

/** 38400 -> "$38,400". Whole dollars only. */
export function formatDollars(value: number): string {
  return `$${Math.round(value).toLocaleString('en-US')}`
}

/** "$38,400" -> 38400. NaN for anything that is not a dollar figure. */
export function parseDollars(text: string): number {
  const cleaned = text.trim().replace(/^\$/, '').replace(/,/g, '')
  if (!/^\d+(\.\d+)?$/.test(cleaned)) return Number.NaN
  return Number(cleaned)
}
