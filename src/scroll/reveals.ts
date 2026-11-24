import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

export function initReveals(): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap.registerPlugin(ScrollTrigger, SplitText)
  void document.fonts.ready.then(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      const interactive = el.matches('a, button') || Boolean(el.querySelector('a, button'))
      const inlineTextTags = new Set(['BR', 'SPAN', 'EM', 'STRONG', 'B', 'I', 'SMALL', 'CODE'])
      const pureText = Array.from(el.querySelectorAll('*')).every((child) => inlineTextTags.has(child.tagName))
      // Hero content must reveal on load at any viewport height, so the primary CTA is never hidden below the 80% line.
      const start = el.closest('.hero') ? 'top bottom' : 'top 80%'

      if (interactive || !pureText) {
        gsap.from(el, {
          y: 24,
          opacity: 0,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start,
          },
        })
        return
      }

      new SplitText(el, {
        type: 'lines',
        autoSplit: true,
        aria: 'none',
        onSplit: (split) => gsap.from(split.lines, {
          yPercent: 110,
          opacity: 0,
          stagger: 0.06,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start,
          },
        }),
      })
    })
  })
}
