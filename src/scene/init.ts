import { localProgress } from '../scroll/progress'
import { measureActRanges, measurePlatformRanges, observeActLayout } from '../scroll/ranges'
import { refreshScroll } from '../scroll/scroll'
import { createAgentsAct, createAgentsCameraKeyframes } from './acts/agents'
import { createBuildAct, createBuildCameraKeyframes } from './acts/build'
import { createDeployAct, createDeployCameraKeyframes } from './acts/deploy'
import { createDesignAct, createDesignCameraKeyframes } from './acts/design'
import { createFinaleActs, createFinaleCameraKeyframes } from './acts/finale'
import { createHeroAct, heroCameraKeyframes } from './acts/hero'
import { createCameraRig } from './camera'
import { createStage } from './stage'
import type { Act } from './types'

interface SceneOptions {
  getProgress(): number
  subscribe(listener: (progress: number) => void): () => void
}

let initialized = false

export function initScene({ getProgress, subscribe }: SceneOptions): void {
  if (initialized) return
  initialized = true

  const canvas = document.createElement('canvas')
  canvas.id = 'stage'
  canvas.setAttribute('aria-hidden', 'true')
  canvas.style.opacity = '0'
  canvas.style.transition = 'opacity 400ms ease'
  canvas.style.pointerEvents = 'none'

  const stage = createStage(canvas)
  if (!stage) return

  document.documentElement.classList.add('webgl')
  document.body.prepend(canvas)
  const hero = createHeroAct()
  const design = createDesignAct((local) => hero.setDesignProgress(local))
  const build = createBuildAct(
    (local, dock) => {
      hero.setBuildDock(dock)
      hero.setBuildProgress(local)
    },
    (local) => design.setBuildProgress(local),
  )
  const agents = createAgentsAct()
  const deploy = createDeployAct((local, packet) => hero.setDeployHandoff(local, packet))
  const finale = createFinaleActs()
  const acts: Act[] = [hero, design, build, agents, deploy, finale.operators, finale.support, finale.shipped]
  acts.forEach((act) => act.init(stage))

  const cameraRig = createCameraRig(
    stage,
    createFinaleCameraKeyframes(
      createDeployCameraKeyframes(
        createAgentsCameraKeyframes(
          createBuildCameraKeyframes(createDesignCameraKeyframes(heroCameraKeyframes)),
        ),
      ),
    ),
  )

  const applyProgress = (progress: number) => {
    cameraRig.scrub(progress)
    acts.forEach((act) => act.update(localProgress(progress, act.range), 0, progress))
  }
  const syncActRanges = () => {
    const measured = measureActRanges()
    const platforms = measurePlatformRanges()
    const rangeMap = new Map([...measured, ...platforms].map(({ id, range }) => [id, range] as const))
    build.setPlatformRanges(new Map(platforms.map(({ id, range }) => [id, range] as const)))
    acts.forEach((act) => {
      const range = rangeMap.get(act.id)
      if (range) act.range = [...range]
    })
    cameraRig.setRanges(rangeMap)
    applyProgress(getProgress())
    refreshScroll()
  }

  subscribe(applyProgress)
  syncActRanges()
  observeActLayout(syncActRanges)
  requestAnimationFrame(() => requestAnimationFrame(() => { canvas.style.opacity = '1' }))
}
