import { CatmullRomCurve3, Vector2, Vector3 } from 'three'
import { onStageFrame } from './stage'
import type { Stage } from './types'

type Point = [number, number, number]

export interface CameraKeyframeTrack {
  position: Point[]
  lookAt: Point[]
}

export interface CameraKeyframes {
  landscape: CameraKeyframeTrack
  portrait: CameraKeyframeTrack
  actIds?: string[]
  actStops?: number[]
}

export interface CameraRig {
  scrub(progress: number): void
  setRanges(ranges: ReadonlyMap<string, [number, number]>): void
  dispose(): void
}

function curve(points: Point[]): CatmullRomCurve3 {
  return new CatmullRomCurve3(points.map(([x, y, z]) => new Vector3(x, y, z)), false, 'catmullrom', 0.5)
}

export function createCameraRig(stage: Stage, keyframes: CameraKeyframes): CameraRig {
  const tracks = {
    landscape: {
      position: curve(keyframes.landscape.position),
      lookAt: curve(keyframes.landscape.lookAt),
    },
    portrait: {
      position: curve(keyframes.portrait.position),
      lookAt: curve(keyframes.portrait.lookAt),
    },
  }
  const pointerTarget = new Vector2()
  const pointerCurrent = new Vector2()
  const position = new Vector3()
  const target = new Vector3()
  let actRanges = new Map<string, [number, number]>()
  let boundaries: number[] = []
  let progress = 0

  const curveProgress = () => {
    const actIds = keyframes.actIds
    if (!actIds?.length) return Math.min(1, Math.max(0, progress))

    if (boundaries.length !== actIds.length + 1) return 0

    if (progress <= boundaries[0]) return 0
    if (progress >= boundaries[boundaries.length - 1]) return 1
    for (let index = 0; index < boundaries.length - 1; index += 1) {
      const start = boundaries[index]
      const end = boundaries[index + 1]
      if (progress <= end) {
        const local = end <= start ? 1 : (progress - start) / (end - start)
        const stops = keyframes.actStops
        const curveStart = stops?.[index] ?? index / (boundaries.length - 1)
        const curveEnd = stops?.[index + 1] ?? (index + 1) / (boundaries.length - 1)
        return curveStart + (curveEnd - curveStart) * Math.min(1, Math.max(0, local))
      }
    }
    return 1
  }

  const apply = () => {
    const track = stage.portrait ? tracks.portrait : tracks.landscape
    const curveT = curveProgress()
    track.position.getPoint(curveT, position)
    track.lookAt.getPoint(curveT, target)
    stage.camera.position.copy(position)
    stage.camera.position.x += pointerCurrent.x
    stage.camera.position.y += pointerCurrent.y
    stage.camera.lookAt(target)
  }

  const finePointer = matchMedia('(hover: hover) and (pointer: fine)')
  const onPointerMove = (event: PointerEvent) => {
    pointerTarget.set(
      (event.clientX / window.innerWidth - 0.5) * 0.3,
      (0.5 - event.clientY / window.innerHeight) * 0.3,
    )
  }
  if (finePointer.matches) window.addEventListener('pointermove', onPointerMove, { passive: true })

  const stopFrame = onStageFrame(stage, (_time, dt) => {
    const alpha = 1 - Math.exp(-dt * 4)
    pointerCurrent.lerp(pointerTarget, alpha)
    apply()
  })
  apply()

  return {
    scrub(nextProgress) {
      progress = nextProgress
      apply()
    },
    setRanges(ranges) {
      actRanges = new Map(ranges)
      const actIds = keyframes.actIds ?? []
      const measured = actIds.map((id) => actRanges.get(id)).filter((range): range is [number, number] => Boolean(range))
      boundaries = []
      if (measured.length === actIds.length && measured.length > 0) {
        boundaries.push(measured[0][0])
        for (let index = 0; index < measured.length - 1; index += 1) {
          boundaries.push((measured[index][1] + measured[index + 1][0]) / 2)
        }
        boundaries.push(measured[measured.length - 1][1])
      }
      apply()
    },
    dispose() {
      stopFrame()
      window.removeEventListener('pointermove', onPointerMove)
    },
  }
}
