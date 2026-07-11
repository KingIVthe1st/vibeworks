import '@fontsource-variable/bricolage-grotesque'
import '@fontsource/plus-jakarta-sans/400.css'
import '@fontsource/plus-jakarta-sans/600.css'
import '@fontsource/ibm-plex-mono/400.css'
import './styles/tokens.css'
import './styles/base.css'
import { initScroll } from './scroll/scroll'
import { initReveals } from './scroll/reveals'
import { initLoader } from './ui/loader'

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
const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
let currentProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll()))
const progressListeners = new Set<(progress: number) => void>()

if (!reducedMotion) {
  initScroll((progress) => {
    currentProgress = progress
    progressListeners.forEach((listener) => listener(progress))
  })
  initReveals()

  const loadScene = () => {
    void import('./scene/init').then(({ initScene }) => initScene({
      getProgress: () => currentProgress,
      subscribe(listener) {
        progressListeners.add(listener)
        return () => progressListeners.delete(listener)
      },
    })).catch(() => undefined)
  }
  requestAnimationFrame(() => {
    if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(loadScene, { timeout: 700 })
    else setTimeout(loadScene, 1)
  })
}

void initLoader({ reducedMotion })
