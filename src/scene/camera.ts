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
}

export interface CameraRig {
  scrub(progress: number): void
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
  let progress = 0

  const apply = () => {
    const track = stage.portrait ? tracks.portrait : tracks.landscape
    track.position.getPointAt(progress, position)
    track.lookAt.getPointAt(progress, target)
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
      progress = Math.min(1, Math.max(0, nextProgress))
      apply()
    },
    dispose() {
      stopFrame()
      window.removeEventListener('pointermove', onPointerMove)
    },
  }
}
