import { afterEach, describe, expect, it, vi } from 'vitest';

import isVisible from '../src/index.js';

class MockIntersectionObserver {
  public readonly disconnect = vi.fn();
  public readonly observe = vi.fn();
  public readonly unobserve = vi.fn();
  public readonly root = null;
  public readonly rootMargin = '';
  public readonly thresholds = [0];

  constructor(
    private readonly callback: IntersectionObserverCallback,
    public readonly options?: IntersectionObserverInit,
  ) {}

  public takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  public trigger(entries: IntersectionObserverEntry[]) {
    this.callback(entries, this as unknown as IntersectionObserver);
  }
}

const installObserverMock = () => {
  let instance: MockIntersectionObserver | undefined;

  const MockObserverConstructor = vi.fn(
    (callback: IntersectionObserverCallback, options?: IntersectionObserverInit) => {
      instance = new MockIntersectionObserver(callback, options);
      return instance;
    },
  );

  vi.stubGlobal(
    'IntersectionObserver',
    MockObserverConstructor as unknown as typeof IntersectionObserver,
  );

  return {
    getInstance: () => {
      if (!instance) {
        throw new Error('IntersectionObserver instance was not created');
      }

      return instance;
    },
    MockObserverConstructor,
  };
};

const createEntry = (
  target: Element,
  isIntersecting: boolean,
): IntersectionObserverEntry =>
  ({
    boundingClientRect: {} as DOMRectReadOnly,
    intersectionRatio: isIntersecting ? 1 : 0,
    intersectionRect: {} as DOMRectReadOnly,
    isIntersecting,
    rootBounds: null,
    target,
    time: Date.now(),
  }) as IntersectionObserverEntry;

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('isVisible', () => {
  it('observes the provided element with default configuration', () => {
    const { getInstance } = installObserverMock();
    const element = {} as Element;

    isVisible(element);

    const observer = getInstance();

    expect(observer.observe).toHaveBeenCalledWith(element);
    expect(observer.options).toEqual({
      root: null,
      rootMargin: '0% 0% 0% 0%',
      threshold: 0,
    });
  });

  it('runs the visible callback when the element intersects', () => {
    const { getInstance } = installObserverMock();
    const element = {} as Element;
    const visible = vi.fn();

    isVisible(element, { visible });

    getInstance().trigger([createEntry(element, true)]);

    expect(visible).toHaveBeenCalledTimes(1);
  });

  it('runs the notVisible callback when inOut is enabled and the element leaves', () => {
    const { getInstance } = installObserverMock();
    const element = {} as Element;
    const notVisible = vi.fn();

    isVisible(element, { inOut: true, notVisible });

    getInstance().trigger([createEntry(element, false)]);

    expect(notVisible).toHaveBeenCalledTimes(1);
  });

  it('unobserves the target after the first visible event when once is enabled', () => {
    const { getInstance } = installObserverMock();
    const element = {} as Element;

    isVisible(element, { once: true });

    const observer = getInstance();
    observer.trigger([createEntry(element, true)]);

    expect(observer.unobserve).toHaveBeenCalledWith(element);
  });

  it('returns a cleanup function that disconnects the observer', () => {
    const { getInstance } = installObserverMock();
    const element = {} as Element;

    const cleanup = isVisible(element);
    const observer = getInstance();

    cleanup();

    expect(observer.disconnect).toHaveBeenCalledTimes(1);
  });
});