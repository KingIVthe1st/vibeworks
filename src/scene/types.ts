import type { PerspectiveCamera, Scene, WebGLRenderer } from 'three'

export interface QualityTier {
  name: 'high' | 'mid' | 'low'
  dpr: number
  instances: number
  bloom: boolean
}

export interface Stage {
  scene: Scene
  camera: PerspectiveCamera
  renderer: WebGLRenderer
  tier: QualityTier
  portrait: boolean
}

export interface Act {
  id: string
  range: [number, number]
  init(stage: Stage): void
  update(local: number, dt: number, global?: number): void
}
