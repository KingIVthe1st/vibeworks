import '@fontsource-variable/bricolage-grotesque'
import '@fontsource/plus-jakarta-sans/400.css'
import '@fontsource/plus-jakarta-sans/600.css'
import '@fontsource/ibm-plex-mono/400.css'
import './styles/tokens.css'
import './styles/base.css'
import { initScroll } from './scroll/scroll'
import { initReveals } from './scroll/reveals'

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

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  initScroll(console.log)
  initReveals()
}
