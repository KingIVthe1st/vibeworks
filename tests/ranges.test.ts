import { describe, expect, it } from 'vitest'
import { deriveActRanges } from '../src/scroll/ranges'

const sections = [
  { id: 'hero', top: 0, bottom: 900 },
  { id: 'design', top: 900, bottom: 1800 },
  { id: 'platforms', top: 1800, bottom: 4500 },
]

describe('deriveActRanges', () => {
  it('preserves DOM ordering while reflecting differently sized sections', () => {
    const result = deriveActRanges(sections, 900, 3600)
    expect(result.map(({ id }) => id)).toEqual(['hero', 'design', 'platforms'])
    expect(result[0].range[0]).toBe(0)
    expect(result[2].range[1] - result[2].range[0]).toBeGreaterThan(result[1].range[1] - result[1].range[0])
  })

  it('clamps every boundary to the document progress range', () => {
    const result = deriveActRanges([
      { id: 'hero', top: -500, bottom: 200 },
      { id: 'end', top: 3800, bottom: 5000 },
    ], 900, 3600)
    expect(result[0].range[0]).toBe(0)
    expect(result[1].range[1]).toBe(1)
  })

  it('never inverts consecutive act ranges', () => {
    const result = deriveActRanges(sections, 900, 3600)
    result.forEach(({ range: [start, end] }, index) => {
      expect(start).toBeLessThanOrEqual(end)
      if (index > 0) {
        expect(start).toBeGreaterThanOrEqual(result[index - 1].range[0])
        expect(end).toBeGreaterThanOrEqual(result[index - 1].range[1])
      }
    })
  })
})
