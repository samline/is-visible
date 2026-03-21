import { vi } from 'vitest'

export class MockIntersectionObserver {
  public readonly disconnect = vi.fn()
  public readonly observe = vi.fn()
  public readonly unobserve = vi.fn()
  public readonly root = null
  public readonly rootMargin = ''
  public readonly thresholds = [0]

  constructor(
    private readonly callback: IntersectionObserverCallback,
    public readonly options?: IntersectionObserverInit
  ) {}

  public takeRecords(): IntersectionObserverEntry[] {
    return []
  }

  public trigger(entries: IntersectionObserverEntry[]) {
    this.callback(entries, this as unknown as IntersectionObserver)
  }
}

export const installObserverMock = () => {
  let instance: MockIntersectionObserver | undefined

  const MockObserverConstructor = vi.fn(
    (
      callback: IntersectionObserverCallback,
      options?: IntersectionObserverInit
    ) => {
      instance = new MockIntersectionObserver(callback, options)
      return instance
    }
  )

  vi.stubGlobal(
    'IntersectionObserver',
    MockObserverConstructor as unknown as typeof IntersectionObserver
  )

  return {
    getInstance: () => {
      if (!instance) {
        throw new Error('IntersectionObserver instance was not created')
      }

      return instance
    },
    MockObserverConstructor
  }
}

export const createEntry = (
  target: Element,
  isIntersecting: boolean
): IntersectionObserverEntry =>
  ({
    boundingClientRect: {} as DOMRectReadOnly,
    intersectionRatio: isIntersecting ? 1 : 0,
    intersectionRect: {} as DOMRectReadOnly,
    isIntersecting,
    rootBounds: null,
    target,
    time: Date.now()
  }) as IntersectionObserverEntry
