import { describe, expect, it } from 'vitest'
import { fibonacciSpherePositions } from '../src/scene/acts/deploy'

describe('fibonacciSpherePositions', () => {
  it('creates the requested number of points on the unit sphere', () => {
    const positions = fibonacciSpherePositions(900)
    expect(positions).toHaveLength(2700)
    for (let index = 0; index < positions.length; index += 3) {
      const length = Math.hypot(positions[index], positions[index + 1], positions[index + 2])
      expect(length).toBeCloseTo(1, 5)
    }
  })

  it('scales down deterministically for lower quality tiers', () => {
    expect(fibonacciSpherePositions(225)).toHaveLength(675)
    expect(fibonacciSpherePositions(225)).toEqual(fibonacciSpherePositions(225))
  })
})
