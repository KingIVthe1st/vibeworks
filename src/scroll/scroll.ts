import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function initScroll(onProgress: (p: number) => void): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap.registerPlugin(ScrollTrigger)
  const lenis = new Lenis({ lerp: 0.1 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => onProgress(self.progress),
  })
}
