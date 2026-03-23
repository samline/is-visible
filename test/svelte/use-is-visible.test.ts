// @vitest-environment jsdom

import { get } from 'svelte/store'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useIsVisible } from '../../src/svelte/index.js'
import {
  createEntry,
  installObserverMock
} from '../helpers/intersection-observer.js'

const requireLifecycle = <T>(lifecycle: T | void, message: string): T => {
  if (!lifecycle) {
    throw new Error(message)
  }

  return lifecycle
}

const requireMethod = <T extends object, K extends keyof T>(
  target: T,
  key: K
): NonNullable<T[K]> => {
  const method = target[key]

  if (!method) {
    throw new Error(`Missing lifecycle method: ${String(key)}`)
  }

  return method as NonNullable<T[K]>
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useIsVisible', () => {
  it('tracks visibility state and the last observer entry', () => {
    const { getInstance } = installObserverMock()
    const node = document.createElement('div')
    const { action, entry, isVisible } = useIsVisible()

    const lifecycle = requireLifecycle(
      action(node),
      'Svelte action did not return a lifecycle object'
    )
    const observer = getInstance()

    expect(observer.observe).toHaveBeenCalledWith(node)
    expect(get(isVisible)).toBe(false)
    expect(get(entry)).toBeNull()

    observer.trigger([createEntry(node, true)])

    expect(get(isVisible)).toBe(true)
    expect(get(entry)?.target).toBe(node)

    observer.trigger([createEntry(node, false)])

    expect(get(isVisible)).toBe(false)

    const destroy = requireMethod(lifecycle, 'destroy')

    destroy()
  })

  it('runs callbacks and respects once', () => {
    const { getInstance } = installObserverMock()
    const node = document.createElement('div')
    const visible = vi.fn()
    const notVisible = vi.fn()
    const { action } = useIsVisible({
      inOut: true,
      notVisible,
      once: true,
      visible
    })

    action(node)

    const observer = getInstance()
    observer.trigger([createEntry(node, true)])
    observer.trigger([createEntry(node, false)])

    expect(visible).toHaveBeenCalledTimes(1)
    expect(notVisible).toHaveBeenCalledTimes(1)
    expect(observer.unobserve).toHaveBeenCalledWith(node)
  })

  it('recreates the observer when the action updates', () => {
    const first = installObserverMock()
    const node = document.createElement('div')
    const notVisible = vi.fn()
    const { action } = useIsVisible()

    const lifecycle = requireLifecycle(
      action(node),
      'Svelte action did not return a lifecycle object'
    )
    const firstObserver = first.getInstance()

    vi.unstubAllGlobals()

    const second = installObserverMock()
    const update = requireMethod(lifecycle, 'update')

    update({ inOut: true, notVisible })
    const secondObserver = second.getInstance()

    expect(firstObserver.disconnect).toHaveBeenCalledTimes(1)

    secondObserver.trigger([createEntry(node, false)])

    expect(notVisible).toHaveBeenCalledTimes(1)

    const destroy = requireMethod(lifecycle, 'destroy')

    destroy()
    expect(secondObserver.disconnect).toHaveBeenCalledTimes(1)
  })
})
