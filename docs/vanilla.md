# Vanilla

Use the shared vanilla implementation when you want to observe DOM elements
directly with callbacks and a cleanup function.

You can import it from the package root or the explicit vanilla subpath.

```ts
import isVisible from '@samline/is-visible'
```

```ts
import isVisible from '@samline/is-visible/vanilla'
```

## Quick start

```ts
const element = document.querySelector('[data-animate]')

if (element) {
  const disconnect = isVisible(element, {
    inOut: true,
    visible: () => element.classList.add('entered'),
    notVisible: () => element.classList.remove('entered')
  })

  // Call this later if you need to stop observing manually.
  disconnect()
}
```

## API

```ts
isVisible(element, options?)
```

### Parameters

| Parameter | Type             | Description                     |
| --------- | ---------------- | ------------------------------- |
| element   | Element          | DOM element to observe          |
| options   | IsVisibleOptions | Optional observer configuration |

### Returns

```ts
() => void
```

The returned function disconnects the observer.

## Options

| Property   | Type                     | Default  | Description                                            |
| ---------- | ------------------------ | -------- | ------------------------------------------------------ |
| inOut      | boolean                  | false    | Enables detection when the element leaves the viewport |
| visible    | () => void               | () => {} | Runs when the element enters the viewport              |
| notVisible | () => void               | () => {} | Runs when the element leaves and `inOut` is enabled    |
| once       | boolean                  | false    | Unobserves the element after the first visible event   |
| options    | IntersectionObserverInit | {}       | Native observer options                                |

### Native IntersectionObserver options

```ts
options: {
  root: null,
  rootMargin: '200px',
  threshold: 0.25
}
```

## Examples

### Entrance animation

```ts
const box = document.querySelector('.animate-me')

if (box) {
  isVisible(box, {
    visible: () => box.classList.add('fade-in'),
    once: true
  })
}
```

### Auto-play or pause video

```ts
const video = document.querySelector('#hero-video') as HTMLVideoElement | null

if (video) {
  isVisible(video, {
    inOut: true,
    visible: () => video.play(),
    notVisible: () => video.pause()
  })
}
```

### Infinite scroll trigger

```ts
const sentinel = document.querySelector('#load-more-trigger')

if (sentinel) {
  isVisible(sentinel, {
    visible: () => fetchMoreData(),
    options: {
      rootMargin: '400px',
      threshold: 0.1
    }
  })
}
```

## When to use Vanilla

Use the vanilla implementation when you are working directly with DOM nodes or
when you want a framework-agnostic API that can be wrapped by your own code.
