import { observeVisibility, type IsVisibleOptions } from '../core/observe.js'

export type { IsVisibleOptions } from '../core/observe.js'

export default function isVisible(
  element: Element,
  options: IsVisibleOptions = {}
) {
  return observeVisibility(element, options)
}
