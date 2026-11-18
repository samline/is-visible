import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { glob } from 'astro/loaders'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import en from './i18n/translations/en'
import { withoutEmptyUnreleased } from '../../shared/lib/changelog.mjs'

type Context = Parameters<ReturnType<typeof glob>['load']>[0]

/** Load a changelog file as one docs entry, refreshed while developing. */
const loadChangelog = async (context: Context, id: string, source: URL, order: number) => {
  const load = async () => {
    const body = withoutEmptyUnreleased(
      (await readFile(source, 'utf8')).replace(/^# Changelog\s*\n/, '')
    )
    const data = await context.parseData({
      id,
      data: {
        ...en.changelog,
        locale: 'en',
        sidebar: { group: 'guides', order },
      },
    })
    context.store.set({
      id,
      data,
      body,
      digest: context.generateDigest(body + JSON.stringify(data)),
      rendered: await context.renderMarkdown(body, { fileURL: source }),
    })
  }
  await load()
  context.watcher?.add(fileURLToPath(source))
  context.watcher?.on('change', async path => {
    if (path === fileURLToPath(source)) await load()
  })
}

const packageDocs = {
  name: 'package-site-documentation',
  async load(context: Context) {
    await glob({
      pattern: '**/*.{md,mdx}',
      base: './src/content/docs',
      generateId: ({ entry }) => entry.replace(/\.mdx?$/, ''),
    }).load(context)
    await loadChangelog(context, 'changelog', new URL('../CHANGELOG.md', context.config.root), 7)
  },
}

const docs = defineCollection({
  loader: packageDocs,
  schema: z.object({
    title: z.string().trim().min(1),
    titleAccent: z.string().trim().min(1).optional(),
    description: z.string().trim().min(1),
    locale: z.enum(['en']),
    sidebar: z.object({
      group: z.enum(['start', 'guides', 'reference', 'api']),
      order: z.number().int().positive(),
    }),
  }),
})
export const collections = { docs }
