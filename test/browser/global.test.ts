// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  createEntry,
  installObserverMock
} from '../helpers/intersection-observer.js'

type BrowserGlobals = typeof globalThis & {
  IsVisible?: {
    observe: (
      element: Element,
      options?: {
        visible?: () => void
        notVisible?: () => void
        inOut?: boolean
        once?: boolean
        options?: IntersectionObserverInit
      }
    ) => () => void
  }
  isVisible?: (
    element: Element,
    options?: {
      visible?: () => void
      notVisible?: () => void
      inOut?: boolean
      once?: boolean
      options?: IntersectionObserverInit
    }
  ) => () => void
}

const browserGlobals = globalThis as BrowserGlobals

afterEach(() => {
  vi.unstubAllGlobals()
  delete browserGlobals.isVisible
  delete browserGlobals.IsVisible
})

describe('browser global bundle entry', () => {
  it('registers window globals backed by the vanilla implementation', async () => {
    const { MockObserverConstructor } = installObserverMock()

    await import('../../src/browser/global.js')

    expect(browserGlobals.isVisible).toBeTypeOf('function')
    expect(browserGlobals.IsVisible).toBeDefined()
    expect(browserGlobals.IsVisible?.observe).toBe(browserGlobals.isVisible)

    const element = document.createElement('div')
    const visible = vi.fn()
    const cleanup = browserGlobals.isVisible?.(element, { visible })
    const namespacedCleanup = browserGlobals.IsVisible?.observe(element, {
      visible
    })

    expect(MockObserverConstructor).toHaveBeenCalledTimes(2)

    const directObserver = MockObserverConstructor.mock.results[0]?.value
    const namespacedObserver = MockObserverConstructor.mock.results[1]?.value

    expect(cleanup).toBeTypeOf('function')
    expect(namespacedCleanup).toBeTypeOf('function')

    expect(directObserver?.observe).toHaveBeenCalledWith(element)
    expect(namespacedObserver?.observe).toHaveBeenCalledWith(element)

    directObserver?.trigger([createEntry(element, true)])
    namespacedObserver?.trigger([createEntry(element, true)])

    expect(visible).toHaveBeenCalledTimes(2)

    cleanup?.()
    namespacedCleanup?.()
    expect(directObserver?.disconnect).toHaveBeenCalledTimes(1)
    expect(namespacedObserver?.disconnect).toHaveBeenCalledTimes(1)
  })
})
