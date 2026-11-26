---
title: 'Framework integrations'
titleAccent: 'integrations'
description: Use @samline/is-visible in React, Vue, Svelte, Astro, Shopify and WordPress with the shipped adapters, a processed script or the pinned classic bundle.
locale: en
sidebar:
  group: guides
  order: 2
---

Each adapter is a subpath and re-exports the root API. In every adapter `isVisible` turns `false` when the element leaves, even without `inOut`; your `notVisible` callback still runs only with `inOut`.

## React, Vue and Svelte

Use the adapter for your framework. Each one observes on mount and stops on unmount.

### React

```jsx
import { useIsVisible, VisibilityObserver } from '@samline/is-visible/react'

const { ref, isVisible, entry } = useIsVisible({ threshold: 0.5 })
return <section ref={ref}>{isVisible ? 'In view' : 'Out of view'}</section>
```

Callbacks always read their latest value; the observer is recreated only when the element or the observation settings change. `<VisibilityObserver as="section" once>{({ isVisible }) => …}</VisibilityObserver>` renders a wrapper.

### Vue

```js
import { useIsVisible } from '@samline/is-visible/vue'

const { target, isVisible } = useIsVisible({ once: true })
```

Bind `ref="target"` in the template. Options may be a ref or a getter. `<VisibilityObserver>` passes `{ isVisible, entry }` to its default slot.

### Svelte

```svelte
<script>
  import { useIsVisible } from '@samline/is-visible/svelte'
  const { action, isVisible } = useIsVisible({ threshold: 0.5 })
</script>

<section use:action>{$isVisible ? 'In view' : 'Out of view'}</section>
```

## Astro

Use a processed client `<script>` in the `.astro` file, not the frontmatter: observing needs a DOM. Without client navigation, call `isVisible()` once at the top of the script. With `<ClientRouter />`, observe after each navigation on `astro:page-load` and stop on `astro:before-swap`, so the next page starts clean.

```astro
<img data-src="/hero.jpg" alt="" />

<script>
  import { isVisible } from '@samline/is-visible'

  let stop: (() => void) | undefined

  // astro:page-load fires only with <ClientRouter />. Without client navigation, run this setup once at the top level.
  document.addEventListener('astro:page-load', () => {
    stop = isVisible('img[data-src]', {
      once: true,
      visible: (entry, image) => {
        const img = image as HTMLImageElement
        img.src = img.dataset.src ?? ''
      },
    })
  })
  document.addEventListener('astro:before-swap', () => stop?.())
</script>
```

## Shopify

Copy `dist/browser/is-visible.global.js` of the pinned release into the theme's `assets/` folder and load it once in `layout/theme.liquid`. It defines `window.isVisible`; mark the elements with a data attribute in your sections.

```liquid
<script src="{{ 'is-visible.global.js' | asset_url }}" defer></script>
```

The theme editor adds and removes sections without a page load, so observe on `shopify:section:load` and call the returned function on `shopify:section:unload`. Both events bubble from the section element, and `event.target` is that element. Run the same `mount` once the DOM is ready, for the sections already on the page. Save this mount code as its own file in `assets/` and load it with `defer` after the bundle: deferred scripts run in order and before `DOMContentLoaded`, so `window.isVisible` exists.

```liquid
<script src="{{ 'visibility.js' | asset_url }}" defer></script>
```

```js
const stops = new Map()

const mount = root => {
  stops.set(
    root,
    window.isVisible(root.querySelectorAll('[data-track]'), {
      once: true,
      visible: (entry, element) => element.classList.add('is-visible'),
    })
  )
}

document.addEventListener('shopify:section:load', event => mount(event.target))
document.addEventListener('shopify:section:unload', event => {
  stops.get(event.target)?.()
  stops.delete(event.target)
})
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.shopify-section').forEach(mount)
})
```

See [Shopify's section events](https://shopify.dev/docs/storefronts/themes/best-practices/editor/integrate-sections-and-blocks).

## WordPress

Enqueue the pinned classic script from your theme or plugin, deferred, on the front end. `'strategy' => 'defer'` needs WordPress 6.3 or newer.

```php
add_action('wp_enqueue_scripts', function () {
  wp_enqueue_script(
    'is-visible',
    'https://cdn.jsdelivr.net/npm/@samline/is-visible@1.1.1/dist/browser/is-visible.global.js',
    [],
    null,
    ['strategy' => 'defer', 'in_footer' => true]
  );
  wp_enqueue_script(
    'my-visibility',
    get_theme_file_uri('assets/visibility.js'),
    ['is-visible'],
    null,
    ['strategy' => 'defer', 'in_footer' => true]
  );
});
```

`assets/visibility.js` is your own file. Declaring `is-visible` as its dependency keeps the order, so `window.isVisible` exists when it runs:

```js
window.isVisible('[data-track]', {
  once: true,
  visible: (entry, element) => element.classList.add('is-visible'),
})
```

Add `data-track` to the elements in your templates or custom HTML blocks. See [wp_enqueue_script](https://developer.wordpress.org/reference/functions/wp_enqueue_script/).
