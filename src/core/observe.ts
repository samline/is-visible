export interface VisibilityCallbacks {
  visible?: () => void
  notVisible?: () => void
}

export interface VisibilityObserverOptions {
  inOut?: boolean
  options?: IntersectionObserverInit
  once?: boolean
}

export interface IsVisibleOptions
  extends VisibilityCallbacks, VisibilityObserverOptions {}

export interface ObserveVisibilityOptions extends IsVisibleOptions {
  onChange?: (entry: IntersectionObserverEntry) => void
}

export function observeVisibility(
  element: Element,
  {
    inOut = false,
    visible = () => {},
    notVisible = () => {},
    options = {},
    once = false,
    onChange
  }: ObserveVisibilityOptions = {}
) {
  const callback = (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) => {
    entries.forEach((entry) => {
      onChange?.(entry)

      if (entry.isIntersecting) {
        visible()

        if (once) {
          observer.unobserve(entry.target)
        }

        return
      }

      if (inOut) {
        notVisible()
      }
    })
  }

  const config: IntersectionObserverInit = {
    root: null,
    rootMargin: '0% 0% 0% 0%',
    threshold: 0,
    ...options
  }

  const observer = new IntersectionObserver(callback, config)

  observer.observe(element)

  return () => observer.disconnect()
}
