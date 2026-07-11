import { describe, expect, it } from 'vitest'
import { isMonitorRectRenderable } from '../src/scene/acts/build'

const viewport = { width: 1440, height: 900 }

describe('isMonitorRectRenderable', () => {
  it('renders a valid figure intersecting the viewport', () => {
    expect(isMonitorRectRenderable({
      top: 520,
      right: 1360,
      bottom: 880,
      left: 784,
      width: 576,
      height: 360,
    }, viewport.width, viewport.height)).toBe(true)
  })

  it('does not render a future platform that is only in the expanded margin', () => {
    expect(isMonitorRectRenderable({
      top: 1080,
      right: 1360,
      bottom: 1440,
      left: 784,
      width: 576,
      height: 360,
    }, viewport.width, viewport.height)).toBe(false)
  })

  it('rejects zero-size and non-finite measurements', () => {
    expect(isMonitorRectRenderable({
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      width: 0,
      height: 0,
    }, viewport.width, viewport.height)).toBe(false)
    expect(isMonitorRectRenderable({
      top: Number.NaN,
      right: 100,
      bottom: 100,
      left: 0,
      width: 100,
      height: 100,
    }, viewport.width, viewport.height)).toBe(false)
  })
})
