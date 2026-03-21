// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'

import { useIsVisible } from '../../src/vue/index.js'
import {
  createEntry,
  installObserverMock
} from '../helpers/intersection-observer.js'

const HookHarness = defineComponent({
  props: {
    inOut: {
      type: Boolean,
      default: false
    },
    notVisible: Function,
    once: {
      type: Boolean,
      default: false
    },
    visible: Function
  },
  setup(props) {
    const { isVisible, target } = useIsVisible(() => ({
      inOut: props.inOut,
      notVisible: props.notVisible as (() => void) | undefined,
      once: props.once,
      visible: props.visible as (() => void) | undefined
    }))

    return () =>
      h('div', {
        ref: target,
        'data-testid': 'target',
        'data-visible': String(isVisible.value)
      })
  }
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useIsVisible', () => {
  it('tracks visibility state for the assigned element', async () => {
    const { getInstance } = installObserverMock()
    const wrapper = mount(HookHarness)
    await nextTick()

    const target = wrapper.get('[data-testid="target"]').element
    const observer = getInstance()

    expect(observer.observe).toHaveBeenCalledWith(target)
    expect(
      wrapper.get('[data-testid="target"]').attributes('data-visible')
    ).toBe('false')

    observer.trigger([createEntry(target, true)])
    await nextTick()

    expect(
      wrapper.get('[data-testid="target"]').attributes('data-visible')
    ).toBe('true')

    observer.trigger([createEntry(target, false)])
    await nextTick()

    expect(
      wrapper.get('[data-testid="target"]').attributes('data-visible')
    ).toBe('false')
  })

  it('runs visibility callbacks and respects once', async () => {
    const { getInstance } = installObserverMock()
    const visible = vi.fn()
    const notVisible = vi.fn()

    const wrapper = mount(HookHarness, {
      props: {
        inOut: true,
        notVisible,
        once: true,
        visible
      }
    })
    await nextTick()

    const target = wrapper.get('[data-testid="target"]').element
    const observer = getInstance()

    observer.trigger([createEntry(target, true)])
    observer.trigger([createEntry(target, false)])
    await nextTick()

    expect(visible).toHaveBeenCalledTimes(1)
    expect(notVisible).toHaveBeenCalledTimes(1)
    expect(observer.unobserve).toHaveBeenCalledWith(target)
  })

  it('disconnects the observer on unmount', async () => {
    const { getInstance } = installObserverMock()
    const wrapper = mount(HookHarness)
    await nextTick()
    const observer = getInstance()

    wrapper.unmount()

    expect(observer.disconnect).toHaveBeenCalledTimes(1)
  })
})
