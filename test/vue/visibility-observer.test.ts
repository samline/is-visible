// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'

import { VisibilityObserver } from '../../src/vue/index.js'
import {
  createEntry,
  installObserverMock
} from '../helpers/intersection-observer.js'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('VisibilityObserver', () => {
  it('renders as the requested element and exposes slot state', async () => {
    const { getInstance } = installObserverMock()

    const wrapper = mount(VisibilityObserver, {
      attrs: {
        'data-testid': 'target'
      },
      props: {
        as: 'section'
      },
      slots: {
        default: ({ isVisible }: { isVisible: boolean }) =>
          h('span', isVisible ? 'visible' : 'hidden')
      }
    })
    await nextTick()

    const target = wrapper.get('[data-testid="target"]').element
    const observer = getInstance()

    expect(target.tagName).toBe('SECTION')
    expect(wrapper.text()).toBe('hidden')

    observer.trigger([createEntry(target, true)])
    await nextTick()

    expect(wrapper.text()).toBe('visible')
  })
})