import { isBrowser, noop, resolveElements } from '@samline/internal'

import type { ElementTarget, ObserveVisibilityOptions } from '../core/types.js'

import { subscribe, type ObserverConfig } from './pool.js'

export type {
  ElementTarget,
  IsVisibleOptions,
  ObserveVisibilityOptions,
  VisibilityCallbacks,
  VisibilityObserverOptions,
} from '../core/types.js'

/** Tolerance for engines that report a ratio a hair below the threshold. */
const RATIO_EPSILON = 0.001

const clampThreshold = (value: number) => Math.min(1, Math.max(0, value))

const normalizeConfig = (options: ObserveVisibilityOptions): ObserverConfig => {
  const legacy = options.options ?? {}
  const rawThreshold = options.threshold ?? legacy.threshold ?? 0
  const threshold = (Array.isArray(rawThreshold) ? rawThreshold : [rawThreshold])
    .filter(value => Number.isFinite(value))
    .map(clampThreshold)
    .sort((a, b) => a - b)

  return {
    root: options.root ?? legacy.root ?? null,
    rootMargin: options.rootMargin ?? legacy.rootMargin ?? '0px',
    threshold: threshold.length > 0 ? Array.from(new Set(threshold)) : [0],
  }
}

/**
 * Watch one or more elements and report when they become visible and, with
 * `inOut`, when they leave again.
 *
 * - Accepts an element, a selector, a NodeList or an array.
 * - `visible` fires once per entry into view, never repeatedly while visible.
 * - `notVisible` fires only after the element was visible.
 * - Observers are shared between calls with the same configuration.
 * - Safe without a DOM: returns a no-op cleanup.
 *
 * Returns a cleanup that stops observing every element of this call.
 */
export const observeVisibility = (
  target: ElementTarget,
  options: ObserveVisibilityOptions = {}
): (() => void) => {
  if (!isBrowser()) return noop

  const elements = resolveElements(target)
  if (elements.length === 0) return noop

  const {
    visible,
    notVisible,
    onChange,
    inOut = false,
    once = false,
    fallback = 'visible',
  } = options

  if (typeof IntersectionObserver !== 'function') {
    if (fallback === 'none' || !visible) return noop
    let cancelled = false
    queueMicrotask(() => {
      if (!cancelled) elements.forEach(element => visible(null, element))
    })
    return () => {
      cancelled = true
    }
  }

  const config = normalizeConfig(options)
  const minRatio = config.threshold[0]!
  const unsubscribers = new Map<Element, () => void>()

  for (const element of elements) {
    let isShown = false

    const unsubscribe = subscribe(element, config, entry => {
      onChange?.(entry, element)

      const nowVisible = entry.isIntersecting && entry.intersectionRatio + RATIO_EPSILON >= minRatio

      if (nowVisible && !isShown) {
        isShown = true
        visible?.(entry, element)
        if (once) {
          unsubscribers.get(element)?.()
          unsubscribers.delete(element)
        }
        return
      }

      if (!nowVisible && isShown) {
        isShown = false
        if (inOut) notVisible?.(entry, element)
      }
    })

    unsubscribers.set(element, unsubscribe)
  }

  return () => {
    unsubscribers.forEach(unsubscribe => unsubscribe())
    unsubscribers.clear()
  }
}
