import { describe, it, expect } from 'vitest'
import { localProgress } from '../src/scroll/progress'

describe('localProgress', () => {
  it('is 0 before the range', () => expect(localProgress(0.1, [0.2, 0.5])).toBe(0))
  it('is 1 after the range', () => expect(localProgress(0.9, [0.2, 0.5])).toBe(1))
  it('interpolates inside the range', () => expect(localProgress(0.35, [0.2, 0.5])).toBeCloseTo(0.5))
  it('handles zero-width range without NaN', () => expect(localProgress(0.3, [0.3, 0.3])).toBe(1))
})
