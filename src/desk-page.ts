import '@fontsource-variable/bricolage-grotesque'
import '@fontsource/plus-jakarta-sans/400.css'
import '@fontsource/plus-jakarta-sans/600.css'
import '@fontsource/ibm-plex-mono/400.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/desk-page.css'

/* The page is complete without this file. Everything here is an enhancement:
   the copy button only appears when the clipboard is actually available, and
   the FAQ is native <details>, which toggles on its own with JS disabled. */

const copyButton = document.querySelector<HTMLButtonElement>('[data-copy-number]')

if (copyButton && navigator.clipboard) {
  const idleLabel = copyButton.textContent ?? 'Copy number'
  let restore = 0

  copyButton.hidden = false

  copyButton.addEventListener('click', () => {
    const number = copyButton.dataset.copyNumber ?? ''

    navigator.clipboard.writeText(number).then(
      () => {
        copyButton.textContent = 'Copied'
      },
      () => {
        copyButton.textContent = 'Could not copy'
      },
    )

    window.clearTimeout(restore)
    restore = window.setTimeout(() => {
      copyButton.textContent = idleLabel
    }, 2400)
  })
}

const answers = document.querySelectorAll<HTMLDetailsElement>('[data-faq] details')

answers.forEach((answer) => {
  answer.addEventListener('toggle', () => {
    if (!answer.open) return

    answers.forEach((other) => {
      if (other !== answer) other.open = false
    })
  })
})
