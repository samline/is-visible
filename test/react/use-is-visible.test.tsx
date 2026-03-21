// @vitest-environment jsdom

import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useIsVisible } from '../../src/react/index.js'
import {
  createEntry,
  installObserverMock
} from '../helpers/intersection-observer.js'

function HookHarness({
  inOut = false,
  notVisible,
  once = false,
  visible
}: {
  inOut?: boolean
  notVisible?: () => void
  once?: boolean
  visible?: () => void
}) {
  const { isVisible, ref } = useIsVisible({ inOut, notVisible, once, visible })

  return <div data-testid='target' data-visible={String(isVisible)} ref={ref} />
}

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('useIsVisible', () => {
  it('tracks visibility state for the assigned element', () => {
    const { getInstance } = installObserverMock()

    render(<HookHarness />)

    const target = screen.getByTestId('target')
    const observer = getInstance()

    expect(observer.observe).toHaveBeenCalledWith(target)
    expect(target.getAttribute('data-visible')).toBe('false')

    act(() => {
      observer.trigger([createEntry(target, true)])
    })

    expect(target.getAttribute('data-visible')).toBe('true')

    act(() => {
      observer.trigger([createEntry(target, false)])
    })

    expect(target.getAttribute('data-visible')).toBe('false')
  })

  it('runs visibility callbacks and respects once', () => {
    const { getInstance } = installObserverMock()
    const visible = vi.fn()
    const notVisible = vi.fn()

    render(<HookHarness inOut notVisible={notVisible} once visible={visible} />)

    const target = screen.getByTestId('target')
    const observer = getInstance()

    act(() => {
      observer.trigger([createEntry(target, true)])
      observer.trigger([createEntry(target, false)])
    })

    expect(visible).toHaveBeenCalledTimes(1)
    expect(notVisible).toHaveBeenCalledTimes(1)
    expect(observer.unobserve).toHaveBeenCalledWith(target)
  })

  it('disconnects the observer on unmount', () => {
    const { getInstance } = installObserverMock()

    const view = render(<HookHarness />)
    const observer = getInstance()

    view.unmount()

    expect(observer.disconnect).toHaveBeenCalledTimes(1)
  })
})
