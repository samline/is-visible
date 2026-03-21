# Vue

Use the Vue implementation from the dedicated subpath so your app only pulls
the Vue-specific runtime and types:

```ts
import { VisibilityObserver, useIsVisible } from '@samline/is-visible/vue'
```

## useIsVisible

The composable gives you a template ref plus visibility state.

```vue
<script setup lang="ts">
import { useIsVisible } from '@samline/is-visible/vue'

const { isVisible, target } = useIsVisible({
  once: true,
  visible: () => console.log('Hero entered the viewport')
})
</script>

<template>
  <section ref="target" :data-visible="isVisible">
    <h2>Hero</h2>
  </section>
</template>
```

### Composable options

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| initialValue | boolean | false | Initial state returned before the observer fires |
| inOut | boolean | false | Enables the notVisible callback when the element leaves |
| visible | () => void | () => {} | Runs when the element enters the viewport |
| notVisible | () => void | () => {} | Runs when the element leaves and inOut is enabled |
| once | boolean | false | Unobserves the element after the first visible event |
| options | IntersectionObserverInit | {} | Native observer options |

### Composable return value

| Property | Type | Description |
| --- | --- | --- |
| target | ShallowRef<Element \| null> | Assign it to the element you want to observe |
| isVisible | Ref<boolean> | Current visibility state |
| entry | ShallowRef<IntersectionObserverEntry \| null> | Last observer entry |

## VisibilityObserver

Use the component when you want a declarative wrapper with scoped slot state.

```vue
<script setup lang="ts">
import { VisibilityObserver } from '@samline/is-visible/vue'
</script>

<template>
  <VisibilityObserver as="article" :once="true" v-slot="{ isVisible }">
    <div :class="isVisible ? 'fade-in' : 'hidden'">Product teaser</div>
  </VisibilityObserver>
</template>
```

## SSR note

The observer is created reactively once the element ref is available on the
client.