# Svelte

Use the Svelte implementation from the dedicated subpath so your app only pulls
the Svelte-specific runtime and types.

This entrypoint is designed for Svelte 5 and follows the native action + store
pattern instead of forcing a component abstraction.

```ts
import {
  createVisibilityAction,
  useIsVisible
} from '@samline/is-visible/svelte'
```

If you need the shared DOM-oriented API instead, see [docs/vanilla.md](docs/vanilla.md).

## useIsVisible

The helper returns a Svelte action plus readable stores for visibility state and
the last observer entry.

```svelte
<script lang="ts">
  import { useIsVisible } from '@samline/is-visible/svelte'

  const { action, isVisible } = useIsVisible({
    once: true,
    visible: () => console.log('Hero entered the viewport')
  })
</script>

<section use:action data-visible={$isVisible}>
  <h2>Hero</h2>
</section>
```

### Helper options

| Property     | Type                     | Default  | Description                                             |
| ------------ | ------------------------ | -------- | ------------------------------------------------------- |
| initialValue | boolean                  | false    | Initial state returned before the observer fires        |
| inOut        | boolean                  | false    | Enables the notVisible callback when the element leaves |
| visible      | () => void               | () => {} | Runs when the element enters the viewport               |
| notVisible   | () => void               | () => {} | Runs when the element leaves and `inOut` is enabled     |
| once         | boolean                  | false    | Unobserves the element after the first visible event    |
| options      | IntersectionObserverInit | {}       | Native observer options                                 |

### Helper return value

| Property  | Type                                                            | Description                 |
| --------- | --------------------------------------------------------------- | --------------------------- |
| action    | VisibilityAction<HTMLElement, UseIsVisibleOptions \| undefined> | Assign it with `use:action` |
| isVisible | Readable<boolean>                                               | Current visibility state    |
| entry     | Readable<IntersectionObserverEntry \| null>                     | Last observer entry         |

## createVisibilityAction

Use the action factory when you only need side effects and do not need the
stores.

```svelte
<script lang="ts">
  import { createVisibilityAction } from '@samline/is-visible/svelte'

  const visibility = createVisibilityAction({
    inOut: true,
    visible: () => console.log('Entered'),
    notVisible: () => console.log('Left')
  })
</script>

<div use:visibility />
```

## When to use Svelte instead of Vanilla

Use the Svelte entrypoint when you want actions and stores that integrate
directly with Svelte's component model.

## SSR note

The observer is only created when the action runs on the client and receives a
real DOM node.
