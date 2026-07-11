import {
  EdgesGeometry,
  ExtrudeGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  PlaneGeometry,
  Shape,
  Vector3,
} from 'three'
import type { CameraKeyframes } from '../camera'
import { onStageFrame } from '../stage'
import type { Act, Stage } from '../types'

interface DrawableEdges {
  geometry: EdgesGeometry
  vertices: number
}

interface Callout {
  element: HTMLDivElement
  anchor: Vector3
  opacity: number
}

export interface DesignAct extends Act {
  setBuildProgress(local: number): void
}

export function easeInOutCubic(value: number): number {
  const clamped = Math.min(1, Math.max(0, value))
  return clamped < 0.5 ? 4 * clamped * clamped * clamped : 1 - Math.pow(-2 * clamped + 2, 3) / 2
}

function roundedRectangle(width: number, height: number, radius: number): Shape {
  const left = -width / 2
  const right = width / 2
  const bottom = -height / 2
  const top = height / 2
  const shape = new Shape()

  shape.moveTo(left + radius, bottom)
  shape.lineTo(right - radius, bottom)
  shape.quadraticCurveTo(right, bottom, right, bottom + radius)
  shape.lineTo(right, top - radius)
  shape.quadraticCurveTo(right, top, right - radius, top)
  shape.lineTo(left + radius, top)
  shape.quadraticCurveTo(left, top, left, top - radius)
  shape.lineTo(left, bottom + radius)
  shape.quadraticCurveTo(left, bottom, left + radius, bottom)
  return shape
}

function addEdges(
  group: Group,
  source: ExtrudeGeometry | PlaneGeometry,
  material: LineBasicMaterial,
  position: [number, number, number] = [0, 0, 0],
): DrawableEdges {
  const geometry = new EdgesGeometry(source, 18)
  const line = new LineSegments(geometry, material)
  line.position.set(...position)
  line.renderOrder = 0
  group.add(line)
  geometry.setDrawRange(0, 0)
  return { geometry, vertices: geometry.getAttribute('position').count }
}

export function createDesignCameraKeyframes(hero: CameraKeyframes): CameraKeyframes {
  return {
    actIds: ['hero', 'design'],
    actStops: [0, 0.5, 1],
    landscape: {
      position: [
        ...hero.landscape.position,
        [2.55, 3.35, 4.85],
        [3.15, 5.1, 3.55],
      ],
      lookAt: [
        ...hero.landscape.lookAt,
        [0.03, 0.18, 0],
        [0, 0.12, 0],
      ],
    },
    portrait: {
      position: [
        ...hero.portrait.position,
        [1.9, 4.8, 6.35],
        [1.7, 6.35, 5.55],
      ],
      lookAt: [
        ...hero.portrait.lookAt,
        [0.02, 0.25, 0],
        [0, 0.15, 0],
      ],
    },
  }
}

export function createDesignAct(onParticleProgress: (local: number) => void): DesignAct {
  const drawables: DrawableEdges[] = []
  const callouts: Callout[] = []
  let blueprint: Group | null = null
  let stageRef: Stage | null = null
  let localProgress = 0
  let buildProgress = 0
  let totalVertices = 0
  let textRects: DOMRect[] = []
  let wasActive = false
  let cacheTextRects = () => undefined

  return {
    id: 'design',
    range: [0, 0],
    init(stage) {
      stageRef = stage
      blueprint = new Group()
      blueprint.name = 'design-blueprint'
      blueprint.rotation.x = -Math.PI / 2
      stage.scene.add(blueprint)

      const material = new LineBasicMaterial({
        color: 0x7c5cff,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      })

      const chassis = new ExtrudeGeometry(roundedRectangle(3.65, 2.05, 0.3), {
        depth: 0.14,
        bevelEnabled: true,
        bevelSegments: stage.tier.name === 'low' ? 1 : 3,
        bevelSize: 0.1,
        bevelThickness: 0.05,
        curveSegments: stage.tier.name === 'low' ? 4 : 8,
        steps: 1,
      })
      chassis.center()
      drawables.push(addEdges(blueprint, chassis, material))
      drawables.push(addEdges(blueprint, new PlaneGeometry(2.62, 1.18), material, [-0.26, 0.2, 0.28]))
      drawables.push(addEdges(blueprint, new PlaneGeometry(1.28, 0.54), material, [0.88, -0.62, 0.53]))
      totalVertices = drawables.reduce((total, drawable) => total + drawable.vertices, 0)

      const updateComposition = () => {
        if (!blueprint || !stageRef) return
        blueprint.position.set(0, stageRef.portrait ? -0.62 : 0, stageRef.portrait ? -0.35 : 0)
        const baseOpacity = stageRef.portrait ? 0.28 : 0.45
        material.opacity = baseOpacity * (1 - easeInOutCubic(Math.min(1, buildProgress * 3)))
      }
      updateComposition()
      onStageFrame(stage, updateComposition)

      if (stage.tier.name !== 'low') {
        cacheTextRects = () => {
          textRects = Array.from(document.querySelectorAll<HTMLElement>('#design h2, #design p, #design ul'))
            .filter((element) => {
              const style = getComputedStyle(element)
              return style.display !== 'none' && style.visibility !== 'hidden'
            })
            .map((element) => element.getBoundingClientRect())
            .filter((rect) => rect.width > 0 && rect.height > 0)
        }
        let resizeTimer = 0
        const scheduleTextRects = () => {
          window.clearTimeout(resizeTimer)
          resizeTimer = window.setTimeout(cacheTextRects, 120)
        }
        window.addEventListener('resize', scheduleTextRects, { passive: true })
        void document.fonts.ready.then(cacheTextRects)

        const layer = document.createElement('div')
        layer.className = 'callout-layer'
        layer.setAttribute('aria-hidden', 'true')
        const definitions: Array<[string, Vector3]> = [
          ['W / 3.65 U', new Vector3(1.92, -1.06, 0.18)],
          ['H / 2.05 U', new Vector3(-1.92, 1.06, 0.18)],
          ['LAYER / 0.53 U', new Vector3(1.48, -0.62, 0.55)],
        ]
        definitions.forEach(([label, anchor]) => {
          const element = document.createElement('div')
          element.className = 'callout'
          element.textContent = label
          layer.append(element)
          callouts.push({ element, anchor, opacity: 0 })
        })
        document.body.append(layer)

        const projected = new Vector3()
        onStageFrame(stage, (_time, dt) => {
          if (!blueprint || !stageRef) return
          const bp = blueprint
          const stg = stageRef
          bp.updateWorldMatrix(true, false)
          const visibility = (localProgress > 0 && localProgress < 1 ? 1 : 0)
            * Math.min(1, Math.max(0, (localProgress - 0.28) / 0.24))
            * (1 - easeInOutCubic(Math.min(1, buildProgress * 4)))
          callouts.forEach((callout) => {
            const { element, anchor } = callout
            projected.copy(anchor).applyMatrix4(bp.matrixWorld).project(stg.camera)
            const onScreen = projected.z > -1 && projected.z < 1
            element.style.left = `${(projected.x * 0.5 + 0.5) * window.innerWidth}px`
            element.style.top = `${(-projected.y * 0.5 + 0.5) * window.innerHeight}px`
            const rect = element.getBoundingClientRect()
            const collides = textRects.some((textRect) => !(
              rect.right <= textRect.left
              || rect.left >= textRect.right
              || rect.bottom <= textRect.top
              || rect.top >= textRect.bottom
            ))
            const target = onScreen && !collides ? visibility : 0
            const opacityStep = Math.min(1, dt / 0.12)
            callout.opacity += Math.max(-opacityStep, Math.min(opacityStep, target - callout.opacity))
            element.style.opacity = String(callout.opacity)
          })
        })
      }
    },
    update(local, _dt) {
      localProgress = Math.min(1, Math.max(0, local))
      const active = localProgress > 0 && localProgress < 1
      if (blueprint) blueprint.visible = active
      if (active && !wasActive) cacheTextRects()
      wasActive = active
      onParticleProgress(localProgress)

      let remaining = Math.floor(totalVertices * easeInOutCubic(localProgress))
      remaining -= remaining % 2
      drawables.forEach(({ geometry, vertices }) => {
        const visible = Math.min(vertices, remaining)
        geometry.setDrawRange(0, visible - (visible % 2))
        remaining = Math.max(0, remaining - vertices)
      })
    },
    setBuildProgress(local) {
      buildProgress = Math.min(1, Math.max(0, local))
    },
  }
}
