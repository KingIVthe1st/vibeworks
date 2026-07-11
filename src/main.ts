import '@fontsource-variable/bricolage-grotesque'
import '@fontsource/plus-jakarta-sans/400.css'
import '@fontsource/plus-jakarta-sans/600.css'
import '@fontsource/ibm-plex-mono/400.css'
import './styles/tokens.css'
import './styles/base.css'
import { initScroll, refreshScroll } from './scroll/scroll'
import { initReveals } from './scroll/reveals'
import { localProgress } from './scroll/progress'
import { measureActRanges, measurePlatformRanges, observeActLayout } from './scroll/ranges'
import { createCameraRig } from './scene/camera'
import { createBuildAct, createBuildCameraKeyframes } from './scene/acts/build'
import { createDesignAct, createDesignCameraKeyframes } from './scene/acts/design'
import { createHeroAct, heroCameraKeyframes } from './scene/acts/hero'
import { createStage } from './scene/stage'
import type { Act } from './scene/types'

document.documentElement.classList.add('js')

const navToggle = document.querySelector<HTMLButtonElement>('#navToggle')
const navLinks = document.querySelector<HTMLElement>('#navLinks')

if (navToggle && navLinks) {
  navToggle.hidden = false
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true'
    navToggle.setAttribute('aria-expanded', String(!expanded))
  })

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navToggle.setAttribute('aria-expanded', 'false'))
  })
}

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

if (!reducedMotion) {
  const canvas = document.createElement('canvas')
  canvas.id = 'stage'
  canvas.setAttribute('aria-hidden', 'true')

  const stage = createStage(canvas)
  if (stage) {
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
    const acts: Act[] = [hero, design, build]
    acts.forEach((act) => act.init(stage))

    const cameraRig = createCameraRig(
      stage,
      createBuildCameraKeyframes(createDesignCameraKeyframes(heroCameraKeyframes)),
    )
    let currentProgress = 0
    const syncActRanges = () => {
      const measured = measureActRanges()
      const platforms = measurePlatformRanges()
      const rangeMap = new Map([...measured, ...platforms].map(({ id, range }) => [id, range] as const))
      build.setPlatformRanges(new Map(platforms.map(({ id, range }) => [id, range] as const)))
      acts.forEach((act) => {
        const range = rangeMap.get(act.id)
        if (range) act.range = [...range]
      })
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      currentProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll))
      cameraRig.setRanges(rangeMap)
      cameraRig.scrub(currentProgress)
      acts.forEach((act) => act.update(localProgress(currentProgress, act.range), 0, currentProgress))
      refreshScroll()
    }

    initScroll((progress) => {
      currentProgress = progress
      cameraRig.scrub(progress)
      acts.forEach((act) => act.update(localProgress(progress, act.range), 0, progress))
    })
    syncActRanges()
    observeActLayout(syncActRanges)
  }

  initReveals()
}
