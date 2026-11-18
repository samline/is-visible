// Live example previews (site/examples/<id>.astro) start through `preview()` so
// the gallery can offer Reset: it runs the cleanup, restores the authored
// markup and runs the setup again. A preview that never calls it keeps no
// Reset button, which suits examples with nothing to undo.

type Cleanup = (() => void) | { readonly destroy: () => void } | void
export type PreviewSetup = (root: HTMLElement) => Cleanup | readonly Cleanup[]

const run = (cleanup: Cleanup | readonly Cleanup[]) => {
  for (const item of Array.isArray(cleanup) ? cleanup : [cleanup]) {
    if (typeof item === 'function') item()
    else item?.destroy()
  }
}

/** Start the preview of example `id` and make it resettable. */
export const preview = (id: string, setup: PreviewSetup) => {
  const host = document.querySelector<HTMLElement>(`[data-package-example$="/${id}"]`)
  const root = host?.querySelector<HTMLElement>('[data-preview-stage]')
  if (!host || !root) return
  const markup = root.innerHTML
  let cleanup = setup(root)
  const button = host.querySelector<HTMLButtonElement>('[data-preview-reset]')
  const actions = host.querySelector<HTMLElement>('[data-preview-actions]')
  if (!button || !actions) return
  actions.hidden = false
  button.addEventListener('click', () => {
    run(cleanup)
    root.innerHTML = markup
    cleanup = setup(root)
  })
}

/** Remove a preview's stored state (for example a theme choice) on Reset. */
export const forget = (key: string) => {
  try {
    localStorage.removeItem(key)
  } catch {
    // Storage can be blocked; there is nothing to forget then.
  }
}
