import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { project } from '../shared/lib/project.mjs'
import { checkContent } from './check-content.mjs'
const audit = JSON.parse(await readFile(new URL('../content-audit.json', import.meta.url), 'utf8'))
assert.equal(
  project.template,
  false,
  'Set site.template=false only after replacing the starter content.'
)
assert.equal(audit.status, 'verified', 'Complete the source/API content audit before publishing.')
assert.equal(
  audit.packageVersion,
  project.version,
  'Reconcile documentation with the current version.'
)
assert.equal(
  audit.themeReview?.status,
  'verified',
  'Confirm the maintainer’s accent preference before release.'
)
assert.ok(audit.themeReview.source?.trim(), 'Record where the theme preference came from.')
assert.equal(audit.themeReview.accentLight, project.accentLight, 'Review the actual light accent.')
assert.equal(audit.themeReview.accentDark, project.accentDark, 'Review the actual dark accent.')
const root = new URL('../', import.meta.url)

/** One package's evidence: capabilities, sources and public exports, all reviewed. */
const checkEvidence = async (evidence, label) => {
  assert.equal(
    evidence.capabilityReview?.status,
    'verified',
    `${label}: review supported integrations, distinct use cases and onboarding depth.`
  )
  for (const group of ['integrations', 'scenarios']) {
    assert.ok(
      evidence.capabilityReview[group]?.length,
      `${label}: inventory real ${group}; a copied starter is not evidence.`
    )
    for (const item of evidence.capabilityReview[group])
      assert.ok(
        item.name && item.evidence && item.destination && item.reviewed === true,
        `${label}: review each ${group} entry with source and a useful destination.`
      )
  }
  assert.equal(
    evidence.capabilityReview.onboarding?.equivalentModes,
    true,
    `${label}: keep initialization modes comparable; put full documents in a separate file viewer.`
  )
  assert.ok(
    evidence.sources?.length > 0,
    `${label}: inventory the existing documentation and source.`
  )
  for (const item of [...evidence.sources, ...(evidence.publicExports ?? [])]) {
    assert.ok(
      item.source && item.destination && item.reviewed === true,
      `${label}: every audited entry needs source, destination and explicit review.`
    )
    const destination = new URL(item.destination, root)
    assert.ok(
      destination.pathname.startsWith(root.pathname),
      `${label}: audit destinations must stay inside this project.`
    )
    await readFile(destination)
  }
}

await checkEvidence(audit, 'content-audit.json')
// Content quality and sibling conventions, on the built combined artifact.
const problems = await checkContent({
  root: fileURLToPath(new URL('../', import.meta.url)),
  project,
  release: true,
  audit,
})
if (problems.length) console.error(problems.map(problem => `✗ ${problem}`).join('\n'))
assert.equal(problems.length, 0, 'Fix the content findings above (run npm run build first).')
console.log(
  'Release evidence is complete. Run npm run verify and manually review claims and copied examples.'
)
