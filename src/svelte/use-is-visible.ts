import { writable, type Readable } from 'svelte/store'

import { observeVisibility, type IsVisibleOptions } from '../core/observe.js'
import type { VisibilityAction } from './types.js'

export interface UseIsVisibleOptions extends IsVisibleOptions {
  initialValue?: boolean
}

export interface UseIsVisibleResult<
  TElement extends HTMLElement = HTMLElement
> {
  action: VisibilityAction<TElement, UseIsVisibleOptions | undefined>
  entry: Readable<IntersectionObserverEntry | null>
  isVisible: Readable<boolean>
}

export function useIsVisible<TElement extends HTMLElement = HTMLElement>(
  initialOptions: UseIsVisibleOptions = {}
): UseIsVisibleResult<TElement> {
  const entryStore = writable<IntersectionObserverEntry | null>(null)
  const visibleStore = writable(initialOptions.initialValue ?? false)

  let currentCleanup = () => {}
  let currentOptions = initialOptions

  const disconnect = () => {
    currentCleanup()
    currentCleanup = () => {}
  }

  const observe = (node: TElement, nextOptions: UseIsVisibleOptions = {}) => {
    currentOptions = nextOptions
    disconnect()

    entryStore.set(null)
    visibleStore.set(nextOptions.initialValue ?? false)

    currentCleanup = observeVisibility(node, {
      ...nextOptions,
      visible: () => {
        visibleStore.set(true)
        nextOptions.visible?.()
      },
      notVisible: () => {
        visibleStore.set(false)
        nextOptions.notVisible?.()
      },
      onChange: (entry) => {
        entryStore.set(entry)

        if (!entry.isIntersecting && !nextOptions.inOut) {
          visibleStore.set(false)
        }
      }
    })
  }

  return {
    action: (node, actionOptions = currentOptions) => {
      observe(node, actionOptions)

      return {
        update(nextOptions = {}) {
          observe(node, nextOptions)
        },
        destroy() {
          disconnect()
        }
      }
    },
    entry: {
      subscribe: entryStore.subscribe
    },
    isVisible: {
      subscribe: visibleStore.subscribe
    }
  }
}
