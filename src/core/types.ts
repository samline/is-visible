import type { ElementTarget } from '@samline/internal'

export type { ElementTarget }

export interface VisibilityCallbacks {
  /**
   * Called when an element becomes visible. `entry` is `null` only in the
   * fallback for browsers without IntersectionObserver.
   */
  visible?: (entry: IntersectionObserverEntry | null, element: Element) => void
  /** Called when a visible element leaves the viewport. Requires `inOut`. */
  notVisible?: (entry: IntersectionObserverEntry, element: Element) => void
}

export interface VisibilityObserverOptions {
  /** Also report leaving (`notVisible`) and later re-entries. Defaults to `false`. */
  inOut?: boolean
  /** Stop observing an element after its first `visible`. Defaults to `false`. */
  once?: boolean
  /** Scroll container to observe against. Defaults to the viewport. */
  root?: Element | Document | null
  /** Grow or shrink the root box, for example `'0px 0px 200px 0px'` to fire early. */
  rootMargin?: string
  /** Share of the element that must be visible, `0` to `1`, or several values. */
  threshold?: number | number[]
  /** @deprecated Use `root`, `rootMargin` and `threshold`. Kept for 0.x code. */
  options?: IntersectionObserverInit
  /**
   * Without IntersectionObserver (very old browsers): `'visible'` (default)
   * reports every element as visible once, so content is never stuck hidden;
   * `'none'` does nothing.
   */
  fallback?: 'visible' | 'none'
}

export interface IsVisibleOptions extends VisibilityCallbacks, VisibilityObserverOptions {}

export interface ObserveVisibilityOptions extends IsVisibleOptions {
  /** Every raw entry, before visibility is evaluated. */
  onChange?: (entry: IntersectionObserverEntry, element: Element) => void
}
