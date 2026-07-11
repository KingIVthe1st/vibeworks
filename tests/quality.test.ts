import { expect, it } from 'vitest'
import { pickTier } from '../src/scene/quality'

it('desktop high-dpr → high', () => expect(pickTier({ mobile: false, dpr: 2, lowPower: false }).name).toBe('high'))
it('mobile → mid with dpr clamp ≤2', () => {
  const tier = pickTier({ mobile: true, dpr: 3, lowPower: false })
  expect(tier.name).toBe('mid')
  expect(tier.dpr).toBeLessThanOrEqual(2)
})
it('lowPower → low, no bloom', () => expect(pickTier({ mobile: true, dpr: 2, lowPower: true })).toMatchObject({ name: 'low', bloom: false }))
