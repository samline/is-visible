# Element Visibility Observer

A lightweight TypeScript utility built on top of the Intersection Observer API
that lets you execute callbacks when a DOM element enters or leaves the
viewport.

It provides a small abstraction for common tasks like:

- Scroll-triggered animations
- Lazy loading content
- Auto-playing or pausing media
- Infinite scroll triggers
- Analytics visibility tracking

The utility returns a cleanup function so you can stop observing elements when
needed.

## Table of Contents

- Installation
- Quick Start
- API Reference
- Options
- Examples
- How It Works
- Best Practices
- Notes
- License

## Installation

Install the package from npm:

```bash
npm install @samline/is-visible
```

Then import it where needed:

```ts
import isVisible from '@samline/is-visible'
```

No external runtime dependencies are required. The utility uses the native
IntersectionObserver API.

## Quick Start

```ts
const disconnect = isVisible(targetElement, {
  visible: () => console.log('Element is visible'),
  notVisible: () => console.log('Element left the viewport'),
  inOut: true
})

disconnect()
```

## API Reference

```ts
isVisible(element, options?)
```

### Parameters

| Parameter | Type             | Description                   |
| --------- | ---------------- | ----------------------------- |
| element   | Element          | DOM element to observe        |
| options   | IsVisibleOptions | Optional configuration object |

### Returns

```ts
() => void
```

A cleanup function that disconnects the observer.

## Options

| Property   | Type                     | Default  | Description                                                       |
| ---------- | ------------------------ | -------- | ----------------------------------------------------------------- |
| inOut      | boolean                  | false    | Enables detection when the element leaves the viewport            |
| visible    | () => void               | () => {} | Triggered when the element enters the viewport                    |
| notVisible | () => void               | () => {} | Triggered when the element leaves the viewport when inOut is true |
| once       | boolean                  | false    | Stops observing after the first visible trigger                   |
| options    | IntersectionObserverInit | {}       | Native IntersectionObserver configuration                         |

### IntersectionObserver Options

You can pass any native observer options:

```ts
{
	root: HTMLElement | null
	rootMargin: string
	threshold: number | number[]
}
```

Example:

```ts
options: {
	rootMargin: '200px',
	threshold: 0.25,
}
```

## Examples

### One-time Entrance Animation

```ts
const box = document.querySelector('.animate-me')

if (box) {
  isVisible(box, {
    visible: () => {
      box.classList.add('fade-in')
    },
    once: true
  })
}
```

### Auto-play or Pause Video

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

### Infinite Scroll or Lazy Loading

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

### React Integration

```ts
useEffect(() => {
  if (!myRef.current) {
    return
  }

  const unobserve = isVisible(myRef.current, {
    visible: () => console.log('Visible!')
  })

  return () => {
    unobserve()
  }
}, [])
```

## How It Works

The utility wraps the native IntersectionObserver.

When the observer fires:

- If the element intersects the viewport, visible() runs.
- If inOut is enabled and the element leaves the viewport, notVisible() runs.

If once is enabled, the element is unobserved after the first visibility event.

## Best Practices

### Use once for animations

```ts
once: true
```

This avoids extra observer work after the first visible transition.

### Use rootMargin for lazy loading

```ts
rootMargin: '300px'
```

This can trigger loading before the element becomes visible.

### Disconnect observers in frameworks

In React, Vue, Astro, or similar environments, always return the cleanup
function when a component unmounts.

## Notes

- Requires IntersectionObserver support in the runtime environment
- Supported by modern browsers
- A polyfill may be required for older browsers

## License

MIT
