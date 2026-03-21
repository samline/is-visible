import {
  computed,
  defineComponent,
  h,
  type Component,
  type PropType
} from 'vue'

import { useIsVisible } from './use-is-visible.js'

export interface VisibilityObserverState {
  entry: IntersectionObserverEntry | null
  isVisible: boolean
}

export interface VisibilityObserverProps {
  as?: string | Component
  initialValue?: boolean
  inOut?: boolean
  notVisible?: () => void
  once?: boolean
  options?: IntersectionObserverInit
  visible?: () => void
}

export const VisibilityObserver = defineComponent({
  name: 'VisibilityObserver',
  props: {
    as: {
      type: [String, Object, Function] as PropType<string | Component>,
      default: 'div'
    },
    initialValue: {
      type: Boolean,
      default: false
    },
    inOut: {
      type: Boolean,
      default: false
    },
    notVisible: Function as PropType<() => void>,
    once: {
      type: Boolean,
      default: false
    },
    options: Object as PropType<IntersectionObserverInit>,
    visible: Function as PropType<() => void>
  },
  setup(props, { attrs, slots }) {
    const composableOptions = computed(() => ({
      initialValue: props.initialValue,
      inOut: props.inOut,
      notVisible: props.notVisible,
      once: props.once,
      options: props.options,
      visible: props.visible
    }))

    const { entry, isVisible, target } = useIsVisible(composableOptions)

    return () => {
      const state: VisibilityObserverState = {
        entry: entry.value,
        isVisible: isVisible.value
      }

      return h(
        props.as,
        { ...attrs, ref: target },
        slots.default ? slots.default(state) : undefined
      )
    }
  }
})