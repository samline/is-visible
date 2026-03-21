import {
  ref,
  shallowRef,
  toValue,
  watchEffect,
  type MaybeRefOrGetter,
  type Ref,
  type ShallowRef
} from 'vue'

import { observeVisibility, type IsVisibleOptions } from '../core/observe.js'

export interface UseIsVisibleOptions extends IsVisibleOptions {
  initialValue?: boolean
}

export interface UseIsVisibleResult<TElement extends Element = HTMLElement> {
  entry: ShallowRef<IntersectionObserverEntry | null>
  isVisible: Ref<boolean>
  target: ShallowRef<TElement | null>
}

export function useIsVisible<TElement extends Element = HTMLElement>(
  optionsSource: MaybeRefOrGetter<UseIsVisibleOptions | undefined> = {}
): UseIsVisibleResult<TElement> {
  const target = shallowRef<TElement | null>(
    null
  ) as ShallowRef<TElement | null>
  const entry = shallowRef<IntersectionObserverEntry | null>(null)
  const isVisible = ref(false)

  watchEffect((onCleanup) => {
    const currentOptions = toValue(optionsSource) ?? {}
    const { initialValue = false, ...options } = currentOptions
    const element = target.value

    if (!element) {
      entry.value = null
      isVisible.value = initialValue
      return
    }

    const disconnect = observeVisibility(element, {
      ...options,
      visible: () => {
        isVisible.value = true
        options.visible?.()
      },
      notVisible: () => {
        isVisible.value = false
        options.notVisible?.()
      },
      onChange: (nextEntry) => {
        entry.value = nextEntry

        if (!nextEntry.isIntersecting && !options.inOut) {
          isVisible.value = false
        }
      }
    })

    onCleanup(disconnect)
  })

  return {
    entry,
    isVisible,
    target
  }
}
