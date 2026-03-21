import { useEffect, useRef, useState, type RefCallback } from 'react'

import { observeVisibility, type IsVisibleOptions } from '../core/observe.js'

export interface UseIsVisibleOptions extends IsVisibleOptions {
  initialValue?: boolean
}

export interface UseIsVisibleResult<TElement extends Element = Element> {
  entry: IntersectionObserverEntry | null
  isVisible: boolean
  ref: RefCallback<TElement>
}

export function useIsVisible<TElement extends Element = HTMLElement>({
  initialValue = false,
  ...options
}: UseIsVisibleOptions = {}): UseIsVisibleResult<TElement> {
  const optionsRef = useRef(options)
  const [element, setElement] = useState<TElement | null>(null)
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)
  const [isVisible, setIsVisible] = useState(initialValue)

  optionsRef.current = options

  useEffect(() => {
    if (!element) {
      setEntry(null)
      setIsVisible(initialValue)
      return
    }

    return observeVisibility(element, {
      ...optionsRef.current,
      visible: () => {
        setIsVisible(true)
        optionsRef.current.visible?.()
      },
      notVisible: () => {
        setIsVisible(false)
        optionsRef.current.notVisible?.()
      },
      onChange: (nextEntry) => {
        setEntry(nextEntry)

        if (!nextEntry.isIntersecting && !optionsRef.current.inOut) {
          setIsVisible(false)
        }
      }
    })
  }, [element, initialValue])

  return {
    entry,
    isVisible,
    ref: setElement as RefCallback<TElement>
  }
}
