import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

export function initReveals(): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap.registerPlugin(ScrollTrigger, SplitText)
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    const split = new SplitText(el, { type: 'lines' })
    gsap.from(split.lines, {
      yPercent: 110,
      opacity: 0,
      stagger: 0.06,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
      },
    })
  })
}
