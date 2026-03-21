import { afterEach, describe, expect, it, vi } from 'vitest'

import isVisible from '../src/index.js'
import {
  createEntry,
  installObserverMock
} from './helpers/intersection-observer.js'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('isVisible', () => {
  it('observes the provided element with default configuration', () => {
    const { getInstance } = installObserverMock()
    const element = {} as Element

    isVisible(element)

    const observer = getInstance()

    expect(observer.observe).toHaveBeenCalledWith(element)
    expect(observer.options).toEqual({
      root: null,
      rootMargin: '0% 0% 0% 0%',
      threshold: 0
    })
  })

  it('runs the visible callback when the element intersects', () => {
    const { getInstance } = installObserverMock()
    const element = {} as Element
    const visible = vi.fn()

    isVisible(element, { visible })

    getInstance().trigger([createEntry(element, true)])

    expect(visible).toHaveBeenCalledTimes(1)
  })

  it('runs the notVisible callback when inOut is enabled and the element leaves', () => {
    const { getInstance } = installObserverMock()
    const element = {} as Element
    const notVisible = vi.fn()

    isVisible(element, { inOut: true, notVisible })

    getInstance().trigger([createEntry(element, false)])

    expect(notVisible).toHaveBeenCalledTimes(1)
  })

  it('unobserves the target after the first visible event when once is enabled', () => {
    const { getInstance } = installObserverMock()
    const element = {} as Element

    isVisible(element, { once: true })

    const observer = getInstance()
    observer.trigger([createEntry(element, true)])

    expect(observer.unobserve).toHaveBeenCalledWith(element)
  })

  it('returns a cleanup function that disconnects the observer', () => {
    const { getInstance } = installObserverMock()
    const element = {} as Element

    const cleanup = isVisible(element)
    const observer = getInstance()

    cleanup()

    expect(observer.disconnect).toHaveBeenCalledTimes(1)
  })
})
