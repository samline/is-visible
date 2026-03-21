// @vitest-environment jsdom

import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { VisibilityObserver } from '../../src/react/index.js'
import {
  createEntry,
  installObserverMock
} from '../helpers/intersection-observer.js'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('VisibilityObserver', () => {
  it('renders as the requested element and exposes render state', () => {
    const { getInstance } = installObserverMock()

    render(
      <VisibilityObserver as='section' data-testid='target'>
        {({ isVisible }) => <span>{isVisible ? 'visible' : 'hidden'}</span>}
      </VisibilityObserver>
    )

    const target = screen.getByTestId('target')
    const observer = getInstance()

    expect(target.tagName).toBe('SECTION')
    expect(target.textContent).toBe('hidden')

    act(() => {
      observer.trigger([createEntry(target, true)])
    })

    expect(target.textContent).toBe('visible')
  })
})
