import { observeVisibility, type ElementTarget, type IsVisibleOptions } from './observe.js'

export * from '../core/index.js'
export { observeVisibility } from './observe.js'

/** Watch `target` and get `visible` / `notVisible` callbacks. Returns a cleanup. */
export const isVisible = (target: ElementTarget, options: IsVisibleOptions = {}): (() => void) => {
  return observeVisibility(target, options)
}

export default isVisible
