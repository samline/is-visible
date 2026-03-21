# React

Use the React implementation from the dedicated subpath so your app only pulls
the React-specific runtime and types:

```ts
import { VisibilityObserver, useIsVisible } from '@samline/is-visible/react'
```

## useIsVisible

The hook gives you a ref callback plus visibility state.

```tsx
import { useIsVisible } from '@samline/is-visible/react'

export function HeroCard() {
  const { isVisible, ref } = useIsVisible({
    once: true,
    visible: () => console.log('Hero entered the viewport')
  })

  return (
    <section ref={ref} data-visible={isVisible}>
      <h2>Hero</h2>
    </section>
  )
}
```

### Hook options

| Property     | Type                     | Default  | Description                                             |
| ------------ | ------------------------ | -------- | ------------------------------------------------------- |
| initialValue | boolean                  | false    | Initial state returned before the observer fires        |
| inOut        | boolean                  | false    | Enables the notVisible callback when the element leaves |
| visible      | () => void               | () => {} | Runs when the element enters the viewport               |
| notVisible   | () => void               | () => {} | Runs when the element leaves and inOut is enabled       |
| once         | boolean                  | false    | Unobserves the element after the first visible event    |
| options      | IntersectionObserverInit | {}       | Native observer options                                 |

### Hook return value

| Property  | Type                              | Description                                      |
| --------- | --------------------------------- | ------------------------------------------------ |
| ref       | RefCallback<Element>              | Assign it to the DOM element you want to observe |
| isVisible | boolean                           | Current visibility state                         |
| entry     | IntersectionObserverEntry \| null | Last observer entry                              |

## VisibilityObserver

Use the component when you want a declarative wrapper with a render function.

```tsx
import { VisibilityObserver } from '@samline/is-visible/react'

export function ProductTeaser() {
  return (
    <VisibilityObserver as='article' once>
      {({ isVisible }) => (
        <div className={isVisible ? 'fade-in' : 'hidden'}>Product teaser</div>
      )}
    </VisibilityObserver>
  )
}
```

## SSR note

The observer is created inside an effect, so it only runs on the client after
the element mounts.
