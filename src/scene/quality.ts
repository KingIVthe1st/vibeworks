import type { QualityTier } from './types'

interface TierOptions {
  mobile: boolean
  dpr: number
  lowPower: boolean
}

export function pickTier({ mobile, dpr, lowPower }: TierOptions): QualityTier {
  if (lowPower) return { name: 'low', dpr: 1, instances: 0.25, bloom: false }
  if (mobile) return { name: 'mid', dpr: Math.min(dpr, 2), instances: 0.5, bloom: false }
  return { name: 'high', dpr: Math.min(dpr, 2), instances: 1, bloom: true }
}
