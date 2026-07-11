import '@fontsource-variable/bricolage-grotesque'
import '@fontsource/plus-jakarta-sans/400.css'
import '@fontsource/plus-jakarta-sans/600.css'
import '@fontsource/ibm-plex-mono/400.css'
import './styles/tokens.css'
import './styles/base.css'
import { initScroll } from './scroll/scroll'
import { initReveals } from './scroll/reveals'
import { localProgress } from './scroll/progress'
import { createCameraRig } from './scene/camera'
import { createHeroAct, heroCameraKeyframes } from './scene/acts/hero'
import { createStage } from './scene/stage'

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
    document.body.prepend(canvas)
    const hero = createHeroAct()
    hero.init(stage)
    hero.update(0, 0)

    const cameraRig = createCameraRig(stage, heroCameraKeyframes)
    cameraRig.scrub(0)
    initScroll((progress) => {
      const heroProgress = localProgress(progress, hero.range)
      cameraRig.scrub(heroProgress)
      hero.update(heroProgress, 0)
    })
  }

  initReveals()
}
