// Vite aliases shared by the landing and docs apps (Node only).
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { project } from './project.mjs'

/** The site root: the directory that holds project.config.json. */
export const siteRoot = new URL('../../', import.meta.url)

const escapeName = name => name.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')

/** True when the site root is the documented package itself (embedded site). */
const embeddedPackage = () => {
  const manifest = fileURLToPath(new URL('package.json', siteRoot))
  if (!existsSync(manifest)) return false
  return JSON.parse(readFileSync(manifest, 'utf8')).name === project.npmName
}

const packageSite = fileURLToPath(new URL('site/', siteRoot)).replace(/\/$/, '')

export const siteAliases = [
  // Optional custom previews in <site root>/site/ (Demo.astro, examples.ts,
  // examples/*.astro; see .agents/custom-previews.md). Without that folder the
  // alias points at an empty generated directory, so its globs match nothing.
  {
    find: '@package-site',
    replacement: existsSync(packageSite)
      ? packageSite
      : fileURLToPath(new URL('../generated/no-site', import.meta.url)),
  },
  // An embedded package site (the package's own repository) imports itself by
  // npm name; Vite resolves it through the package's exports. Build it first.
  ...(embeddedPackage()
    ? [
        {
          find: new RegExp(`^${escapeName(project.npmName)}$`),
          replacement: fileURLToPath(siteRoot).replace(/\/$/, ''),
        },
      ]
    : []),
]
