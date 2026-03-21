import {
  createElement,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode
} from 'react'

import { useIsVisible, type UseIsVisibleOptions } from './use-is-visible.js'

export interface VisibilityObserverState {
  entry: IntersectionObserverEntry | null
  isVisible: boolean
}

type VisibilityObserverOwnProps = UseIsVisibleOptions & {
  as?: ElementType
  children?: ReactNode | ((state: VisibilityObserverState) => ReactNode)
}

export type VisibilityObserverProps<TElement extends ElementType = 'div'> =
  VisibilityObserverOwnProps &
    Omit<
      ComponentPropsWithoutRef<TElement>,
      keyof VisibilityObserverOwnProps | 'ref'
    >

export function VisibilityObserver<TElement extends ElementType = 'div'>({
  as,
  children,
  initialValue,
  inOut,
  notVisible,
  once,
  options,
  visible,
  ...elementProps
}: VisibilityObserverProps<TElement>) {
  const Component = as ?? 'div'
  const { entry, isVisible, ref } = useIsVisible({
    initialValue,
    inOut,
    notVisible,
    once,
    options,
    visible
  })
  const content =
    typeof children === 'function' ? children({ entry, isVisible }) : children

  return createElement(Component, { ...elementProps, ref }, content)
}
