import {
  useIsVisible,
  type UseIsVisibleOptions,
  type UseIsVisibleResult
} from './use-is-visible.js'
import type { VisibilityAction } from './types.js'

export function createVisibilityAction<
  TElement extends HTMLElement = HTMLElement
>(
  initialOptions: UseIsVisibleOptions = {}
): VisibilityAction<TElement, UseIsVisibleOptions | undefined> {
  return useIsVisible<TElement>(initialOptions).action
}

export type VisibilityActionResult<TElement extends HTMLElement = HTMLElement> =
  UseIsVisibleResult<TElement>
