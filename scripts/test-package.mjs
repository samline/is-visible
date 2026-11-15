// Checks what npm actually publishes: every file the manifest points to is in
// the tarball, the ESM and CommonJS entries load on a server (no DOM), the
// browser bundle parses as a classic script, and no website or dev file leaks.
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import vm from 'node:vm'

const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
const [packed] = JSON.parse(
  execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], { encoding: 'utf8' })
)
const paths = new Set(packed.files.map(file => file.path))
for (const file of ['package.json', 'README.md', 'LICENSE.md', 'CHANGELOG.md'])
  assert.ok(paths.has(file), `Missing published file: ${file}`)
for (const path of paths)
  assert.ok(
    !/^(landing|docs|shared|site|site-tools|site-tests|site-e2e|test|tests|scripts|\.github|\.agents|\.claude)\//.test(
      path
    ),
    `Unexpected published file: ${path}`
  )

const targets = { import: new Set(), require: new Set(), other: new Set() }
const collect = (entry, condition = 'other') => {
  if (typeof entry === 'string') {
    assert.ok(paths.has(entry.replace(/^\.\//, '')), `Missing export target: ${entry}`)
    targets[condition]?.add(entry)
  } else if (entry && typeof entry === 'object')
    for (const [key, value] of Object.entries(entry))
      collect(value, key === 'import' || key === 'require' ? key : condition)
}
collect(manifest.exports)
for (const field of ['main', 'module', 'types'])
  if (manifest[field])
    assert.ok(paths.has(manifest[field].replace(/^\.\//, '')), `Missing ${field}`)

const require = createRequire(import.meta.url)
const dist = path => new URL(`../${path.replace(/^\.\//, '')}`, import.meta.url)
for (const entry of targets.import) {
  if (!/\.m?js$/.test(entry)) continue
  const api = await import(dist(entry).href).catch(error => {
    // Framework adapters need their optional peer installed.
    if (/Cannot find (package|module) '(react|vue|svelte)/.test(error.message)) return null
    throw error
  })
  if (api) assert.ok(Object.keys(api).length > 0, `${entry} exports nothing`)
}
for (const entry of targets.require) {
  if (!/\.c?js$/.test(entry)) continue
  try {
    assert.ok(Object.keys(require(dist(entry).pathname)).length > 0, `${entry} exports nothing`)
  } catch (error) {
    if (!/Cannot find (package|module) '(react|vue|svelte)/.test(error.message)) throw error
  }
}
for (const path of paths)
  if (/^dist\/browser\/.*\.global\.js$/.test(path))
    new vm.Script(await readFile(dist(path), 'utf8'), { filename: path })
console.log(`Published package verified (${paths.size} files).`)
