// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest'

import { createVisibilityAction } from '../../src/svelte/index.js'
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

describe('createVisibilityAction', () => {
  it('observes the provided node and forwards callbacks', () => {
    const { getInstance } = installObserverMock()
    const node = document.createElement('div')
    const visible = vi.fn()
    const action = createVisibilityAction({ visible })

    const lifecycle = requireLifecycle(
      action(node),
      'Svelte action did not return a lifecycle object'
    )
    const observer = getInstance()

    expect(observer.observe).toHaveBeenCalledWith(node)

    observer.trigger([createEntry(node, true)])

    expect(visible).toHaveBeenCalledTimes(1)

    const destroy = requireMethod(lifecycle, 'destroy')

    destroy()
    expect(observer.disconnect).toHaveBeenCalledTimes(1)
  })
})
