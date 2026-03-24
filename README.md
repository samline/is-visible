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

The package ships a shared vanilla API plus framework-specific entrypoints for
React, Vue and Svelte. It also includes a browser bundle for projects that load
JavaScript directly in the page without a build step.

## Table of Contents

- Installation
- Entry Points
- Quick Start
- Documentation Guides
- Shared API Summary
- Shared Options
- Notes
- License

## Installation

Choose the installation method that matches your environment.

### npm

```bash
npm install @samline/is-visible
```

### pnpm

```bash
pnpm add @samline/is-visible
```

### yarn

```bash
yarn add @samline/is-visible
```

### bun

```bash
bun add @samline/is-visible
```

### CDN / Browser

Use the browser bundle when your project loads scripts directly in the page and cannot compile npm modules.

This is useful in environments such as Shopify themes, WordPress templates, or plain HTML pages with no build step.

```html
<script src="https://cdn.jsdelivr.net/npm/@samline/is-visible@0.5.0/dist/browser/is-visible.global.js"></script>
```

Then use it from a normal script:

```html
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const element = document.querySelector('[data-track-visibility]')

    if (!element) return

    window.IsVisible.observe(element, {
      inOut: true,
      visible: () => {
        console.log('Element entered the viewport')
        element.classList.add('is-visible')
      },
      notVisible: () => {
        console.log('Element left the viewport')
      }
    })
  })
</script>
```

After the CDN script loads, the browser build exposes `window.isVisible(...)` and `window.IsVisible.observe(...)`.

Use one of the package manager commands above when your project has a build
step. If you are working in Shopify, WordPress or any browser-only template
without compilation, use the browser bundle described in [docs/browser.md](docs/browser.md).

## Entry Points

Choose the entrypoint that matches your stack so you only import the
implementation you need.

| Use case                    | Import                                                                              | Guide                              |
| --------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------- |
| Vanilla JS                  | `import isVisible from '@samline/is-visible'`                                       | [docs/vanilla.md](docs/vanilla.md) |
| Vanilla JS explicit subpath | `import isVisible from '@samline/is-visible/vanilla'`                               | [docs/vanilla.md](docs/vanilla.md) |
| Browser / CDN               | `<script src=".../dist/browser/is-visible.global.js"></script>`                     | [docs/browser.md](docs/browser.md) |
| React                       | `import { VisibilityObserver, useIsVisible } from '@samline/is-visible/react'`      | [docs/react.md](docs/react.md)     |
| Vue                         | `import { VisibilityObserver, useIsVisible } from '@samline/is-visible/vue'`        | [docs/vue.md](docs/vue.md)         |
| Svelte                      | `import { createVisibilityAction, useIsVisible } from '@samline/is-visible/svelte'` | [docs/svelte.md](docs/svelte.md)   |

No external runtime dependencies are required for the shared vanilla or browser
bundle APIs. The package uses the native IntersectionObserver API.

## Quick Start

```ts
import isVisible from '@samline/is-visible'

const disconnect = isVisible(targetElement, {
  visible: () => console.log('Element is visible'),
  notVisible: () => console.log('Element left the viewport'),
  inOut: true
})

disconnect()
```

For detailed setup and additional examples:

- Vanilla DOM usage: [docs/vanilla.md](docs/vanilla.md)
- Browser/CDN usage: [docs/browser.md](docs/browser.md)
- React usage: [docs/react.md](docs/react.md)
- Vue usage: [docs/vue.md](docs/vue.md)
- Svelte usage: [docs/svelte.md](docs/svelte.md)

## Documentation Guides

### Vanilla

Use the shared DOM-oriented API with direct element references and callbacks.

Guide: [docs/vanilla.md](docs/vanilla.md)

### Browser and CDN

Use the browser bundle when your project loads scripts directly in the page and
cannot compile npm modules.

Guide: [docs/browser.md](docs/browser.md)

### React

Use the React-native hook and component entrypoint instead of wiring the vanilla
API manually inside effects.

Guide: [docs/react.md](docs/react.md)

### Vue

Use the Vue-native composable and component entrypoint instead of wiring the
vanilla API manually in lifecycle hooks.

Guide: [docs/vue.md](docs/vue.md)

### Svelte

Use the Svelte-native helper and action entrypoint instead of wiring the
vanilla API manually in onMount blocks.

Guide: [docs/svelte.md](docs/svelte.md)

## Shared API Summary

The shared vanilla API has the following shape:

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

The returned cleanup function disconnects the observer.

## Shared Options

| Property   | Type                     | Default  | Description                                                       |
| ---------- | ------------------------ | -------- | ----------------------------------------------------------------- |
| inOut      | boolean                  | false    | Enables detection when the element leaves the viewport            |
| visible    | () => void               | () => {} | Runs when the element enters the viewport                         |
| notVisible | () => void               | () => {} | Runs when the element leaves the viewport when `inOut` is enabled |
| once       | boolean                  | false    | Stops observing after the first visible trigger                   |
| options    | IntersectionObserverInit | {}       | Native IntersectionObserver configuration                         |

All framework-specific implementations map to these same visibility semantics,
even if their return values differ by framework.

## Notes

- Requires IntersectionObserver support in the runtime environment
- Supported by modern browsers
- A polyfill may be required for older browsers

## License

MIT
