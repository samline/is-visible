# Browser and CDN

Use the browser bundle when your project loads JavaScript directly in the page
and cannot compile npm modules. This is the right fit for Shopify themes,
WordPress templates and other no-bundler environments.

## Load the bundle

```html
<script src="https://cdn.jsdelivr.net/npm/@samline/is-visible@0.5.0/dist/browser/is-visible.global.js"></script>
```

After that script loads, the package exposes two browser globals:

- `window.isVisible(...)` as the default ergonomic API
- `window.IsVisible.observe(...)` as the namespaced alternative

## Default browser API

Use the short global when you control the page and do not expect naming
collisions.

```html
<script>
  const element = document.querySelector('[data-animate]')

  if (element) {
    const cleanup = window.isVisible(element, {
      visible: () => element.classList.add('entered')
    })
  }
</script>
```

## Namespaced browser API

Use the namespaced alternative when you want to avoid a short global in pages
with many third-party scripts.

```html
<script>
  const element = document.querySelector('[data-animate]')

  if (element) {
    const cleanup = window.IsVisible.observe(element, {
      inOut: true,
      visible: () => console.log('Entered'),
      notVisible: () => console.log('Left')
    })
  }
</script>
```

## Shared options

Both browser globals use the same shared options as the vanilla API:

| Property   | Type                     | Default  | Description                                            |
| ---------- | ------------------------ | -------- | ------------------------------------------------------ |
| inOut      | boolean                  | false    | Enables detection when the element leaves the viewport |
| visible    | () => void               | () => {} | Runs when the element enters the viewport              |
| notVisible | () => void               | () => {} | Runs when the element leaves and `inOut` is enabled    |
| once       | boolean                  | false    | Unobserves the element after the first visible event   |
| options    | IntersectionObserverInit | {}       | Native observer options                                |

## Example: Shopify or WordPress style setup

```html
<script src="https://cdn.jsdelivr.net/npm/@samline/is-visible@0.5.0/dist/browser/is-visible.global.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-track-visibility]').forEach((element) => {
      window.isVisible(element, {
        visible: () => element.classList.add('is-visible'),
        once: true
      })
    })
  })
</script>
```

## When to use Browser instead of npm imports

Use the browser bundle when your project cannot import npm modules directly. If
your project has a build step, prefer the npm entrypoints documented in
[README.md](../README.md) and [docs/vanilla.md](docs/vanilla.md).
