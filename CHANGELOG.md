# Changelog

All notable changes to this package. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [semver](https://semver.org/).

## [1.1.2] - 2026-11-27

### Changed

- `src/core` now holds only the option types; the observers, pool and state moved to `src/vanilla`, following the family package shape. The public API and behavior are unchanged.

## [1.1.1] - 2026-11-17

### Fixed

- Vue: `<VisibilityObserver>` accepts the `root` and `fallback` props, like the React component and `useIsVisible()`.

## [1.1.0] - 2026-11-15

### Added

- `@samline/is-visible/testing` exports `resetObservers()`, so packages that bundle the observer pool can reset it between unit tests. Test-only; not for production code.

### Changed

- The package moved from the `samline/utils` monorepo to its own repository, [samline/is-visible](https://github.com/samline/is-visible). Homepage, repository and documentation links point to the package's own site.

## [1.0.1] - 2026-11-13

### Fixed

- Documentation only: the README follows the canonical @samline structure with links to the new website (Home, examples, docs and agent skill), and the package now ships LICENSE.md.

## [1.0.0] - 2026-11-12

### Added

- Move to the `samline/utils` monorepo and release 1.0.

  - **Breaking:** `notVisible` no longer fires for an element that was never visible, and `visible` no longer repeats while the element stays visible.
  - Callbacks receive `(entry, element)`. Targets may be an element, a selector, a `NodeList` or an array.
  - Calls with the same `root`, `rootMargin` and `threshold` share one `IntersectionObserver`.
  - Top-level `root`, `rootMargin` and `threshold` options. The nested `options` object is deprecated but still supported.
  - `fallback: 'visible' | 'none'` for browsers without IntersectionObserver, so content is never left hidden.
  - React, Vue and Svelte adapters share one engine, and `isVisible` resets when the element leaves.
  - CommonJS build, minified browser bundle and `./browser` export.
