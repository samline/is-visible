// Custom package examples (see .agents/custom-previews.md).
// A package lists its examples in site/examples.ts and renders each live
// preview in site/examples/<id>.astro with the real package.
// The copied files below are tested in a browser, so they cannot drift from
// the preview without a failing check.
import { format, resolveConfig } from 'prettier'
import controls from '../i18n/translations/en/controls'
import { project } from './project.mjs'

export interface PackageExample {
  readonly id: string
  /** Short navigation label. */
  readonly tab: string
  /** The visitor's task, used as the section heading. */
  readonly title: string
  readonly description: string
  readonly files: {
    readonly html: string
    readonly css?: string
    readonly js: string
    readonly esm: string
  }
}

const records = import.meta.glob<readonly PackageExample[]>('@package-site/examples.ts', {
  eager: true,
  import: 'default',
})
const previews = import.meta.glob<{ default: unknown }>('@package-site/examples/*.astro', {
  eager: true,
})

const options = await resolveConfig(process.cwd())

const keyFor = <T>(map: Record<string, T>, suffix: string) =>
  Object.keys(map).find(path => path.endsWith(suffix))

/** The examples the package declares in site/examples.ts (none without it). */
export const examplesFor = (): readonly PackageExample[] => {
  const key = keyFor(records, '/examples.ts')
  if (!key) return []
  const list = records[key]!
  const ids = new Set<string>()
  for (const item of list) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(item.id))
      throw new Error(`site example ids must be lowercase slugs: "${item.id}"`)
    if (ids.has(item.id)) throw new Error(`site/examples.ts repeats the example id "${item.id}"`)
    ids.add(item.id)
    if (!keyFor(previews, `/examples/${item.id}.astro`))
      throw new Error(`site example "${item.id}" needs site/examples/${item.id}.astro`)
  }
  return list
}

/** The live preview component of one example. */
export const previewFor = (id: string) =>
  previews[keyFor(previews, `/examples/${id}.astro`)!]!.default as (
    props: Record<string, unknown>
  ) => unknown

const documentFor = (example: PackageExample, separate: boolean, mode: ExampleMode) => {
  const { cdnScript, cdnStylesheet } = project.delivery
  const css = example.files.css?.trim()
  const javascript = mode === 'esm' ? example.files.esm : example.files.js
  const type = mode === 'esm' ? ' type="module"' : ''
  const head = [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${example.title}</title>`,
    mode === 'cdn' && cdnStylesheet ? `<link rel="stylesheet" href="${cdnStylesheet}">` : '',
    css
      ? separate
        ? '<link rel="stylesheet" href="./style.css">'
        : `<style>\n${css}\n</style>`
      : '',
  ]
  const scripts = [
    mode === 'cdn' && cdnScript ? `<script src="${cdnScript}"></script>` : '',
    separate
      ? `<script${type} src="./main.js"${mode === 'cdn' ? ' defer' : ''}></script>`
      : `<script${type}>\n${javascript}\n</script>`,
  ]
  return `<!doctype html>\n<html lang="en">\n<head>\n${head.filter(Boolean).join('\n')}\n</head>\n<body>\n<main>\n${example.files.html}\n</main>\n${scripts.filter(Boolean).join('\n')}\n</body>\n</html>`
}

/** Formatted, copyable files for one example: separate files plus one complete document. */
export type ExampleMode = 'cdn' | 'esm'

export const modesFor = (): readonly ExampleMode[] =>
  project.delivery.cdnScript ? ['cdn', 'esm'] : ['esm']

export const filesFor = async (example: PackageExample, mode: ExampleMode = modesFor()[0]!) => {
  const files = [
    {
      id: 'html',
      label: controls.codeFiles.html,
      filename: 'index.html',
      language: 'html' as const,
      code: await format(documentFor(example, true, mode), {
        ...options,
        parser: 'html',
      }),
    },
    ...(example.files.css?.trim()
      ? [
          {
            id: 'css',
            label: controls.codeFiles.css,
            filename: 'style.css',
            language: 'css' as const,
            code: await format(example.files.css, {
              ...options,
              parser: 'css',
            }),
          },
        ]
      : []),
    {
      id: 'javascript',
      label: controls.codeFiles.javascript,
      filename: 'main.js',
      language: 'javascript' as const,
      code: await format(mode === 'esm' ? example.files.esm : example.files.js, {
        ...options,
        parser: 'babel',
      }),
    },
  ]
  const complete = await format(documentFor(example, false, mode), {
    ...options,
    parser: 'html',
  })
  return { files, complete }
}
