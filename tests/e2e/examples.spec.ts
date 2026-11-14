// The website shows each example twice: a live preview and copyable files
// (site/examples.ts) that load the browser bundle. These tests run the copyable
// files against the built bundle, so the code people copy keeps working.
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'

import isVisibleExamples from '../../site/examples'

const bundle = (pkg: string) =>
  fileURLToPath(new URL(`../../dist/browser/${pkg}.global.js`, import.meta.url))

type Example = { id: string; files: { html: string; css?: string; js: string } }

const open = async (page: import('@playwright/test').Page, pkg: string, example: Example) => {
  await page.setContent(
    `<!doctype html><html><head><style>${example.files.css ?? ''}</style></head><body><main>${example.files.html}</main></body></html>`
  )
  await page.addScriptTag({ path: bundle(pkg) })
  await page.addScriptTag({ content: example.files.js })
}

const find = <T extends Example>(list: readonly T[], id: string) =>
  list.find(item => item.id === id)!

test.describe('is-visible copyable examples', () => {
  test('reveal marks sections once as they enter', async ({ page }) => {
    await open(page, 'is-visible', find(isVisibleExamples, 'reveal'))
    await expect(page.locator('.reveal').first()).toHaveClass(/is-visible/)
    await page.locator('#list').evaluate(element => (element.scrollTop = element.scrollHeight))
    await expect(page.locator('.reveal').last()).toHaveClass(/is-visible/)
  })

  test('lazy load fills items before they scroll in', async ({ page }) => {
    await open(page, 'is-visible', find(isVisibleExamples, 'lazy'))
    await expect(page.locator('#feed article').first()).toHaveText('Story 1 loaded')
    await expect(page.locator('#feed article').nth(4)).toHaveText('Loading…')
    await page.locator('#feed').evaluate(element => (element.scrollTop = element.scrollHeight))
    await expect(page.locator('#feed article').nth(4)).toHaveText('Story 5 loaded')
  })

  test('pause runs only while the panel is visible', async ({ page }) => {
    await open(page, 'is-visible', find(isVisibleExamples, 'pause'))
    await page.waitForTimeout(400)
    await expect(page.locator('#ticks')).toHaveText('0')
    await page.locator('#panel').scrollIntoViewIfNeeded()
    await expect
      .poll(async () => Number(await page.locator('#ticks').textContent()))
      .toBeGreaterThan(1)
    await page.locator('#box').evaluate(element => (element.scrollTop = 0))
    await page.waitForTimeout(300)
    const paused = Number(await page.locator('#ticks').textContent())
    await page.waitForTimeout(600)
    expect(Number(await page.locator('#ticks').textContent())).toBe(paused)
  })
})
