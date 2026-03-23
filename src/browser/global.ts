import isVisible from '../vanilla/index.js'

import type { IsVisibleOptions } from '../core/observe.js'

export type { IsVisibleOptions }

export interface IsVisibleBrowserApi {
  observe: typeof isVisible
}

export { isVisible }

const globalScope = globalThis as typeof globalThis & {
  IsVisible?: Partial<IsVisibleBrowserApi>
  isVisible?: typeof isVisible
}

globalScope.isVisible = isVisible
globalScope.IsVisible = {
  ...globalScope.IsVisible,
  observe: isVisible
}
