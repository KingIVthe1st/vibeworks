import gsap from 'gsap'
import {
  ACESFilmicToneMapping,
  Color,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three'
import { pickTier } from './quality'
import type { Stage } from './types'

type FrameCallback = (time: number, dt: number) => void

const frameCallbacks = new WeakMap<Stage, Set<FrameCallback>>()

export function onStageFrame(stage: Stage, callback: FrameCallback): () => void {
  const callbacks = frameCallbacks.get(stage)
  if (!callbacks) return () => undefined
  callbacks.add(callback)
  return () => callbacks.delete(callback)
}

export function createStage(canvas: HTMLCanvasElement): Stage | null {
  const mobile = matchMedia('(pointer: coarse)').matches || window.innerWidth < 768
  const lowPower = mobile && (navigator.hardwareConcurrency ?? 8) <= 4
  const tier = pickTier({ mobile, dpr: window.devicePixelRatio || 1, lowPower })

  let renderer: WebGLRenderer
  try {
    renderer = new WebGLRenderer({
      canvas,
      antialias: tier.name !== 'low',
      alpha: false,
      powerPreference: 'high-performance',
    })
  } catch {
    return null
  }

  renderer.setPixelRatio(Math.min(tier.dpr, 2))
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1

  const scene = new Scene()
  scene.background = new Color(0x000000)
  const camera = new PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100)

  const stage: Stage = {
    scene,
    camera,
    renderer,
    tier,
    portrait: window.innerHeight > window.innerWidth,
  }
  frameCallbacks.set(stage, new Set())

  const resize = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    stage.portrait = height > width
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setPixelRatio(Math.min(tier.dpr, 2))
    renderer.setSize(width, height, false)
  }
  resize()
  window.addEventListener('resize', resize, { passive: true })

  let previous = gsap.ticker.time
  gsap.ticker.add((time) => {
    const dt = Math.min(0.05, Math.max(0, time - previous))
    previous = time
    frameCallbacks.get(stage)?.forEach((callback) => callback(time, dt))
    renderer.render(scene, camera)
  })

  return stage
}
