# Website

The website of @samline/is-visible (Home, Examples and Docs) is the @samline package-landing-docs
template embedded in this repository, deployed to https://samline.github.io/is-visible/ by
`.github/workflows/deploy.yml` (GitHub Pages, source: GitHub Actions).

- `landing/`, `docs/`, `shared/`: Astro apps and shared UI, copied from the template.
- `site/`: this package's live previews (Demo, examples and their copyable files).
- `site-tools/`, `site-tests/`, `site-e2e/`: build, audit and test tooling for the website.
- `project.config.json`: identity, accent, CDN URLs and dev ports.
- `content-audit.json`: reviewed source and API coverage.

Commands (run with Bun after `pnpm install`): `bun run build` first (previews import the
package), then `bun run site:build`, `bun run site:check:release` and `bun run site:verify`.
Home copy lives in `landing/src/i18n/translations/en/sections.ts`; articles in
`docs/src/content/docs`. Change shared website code in the template first (family/AGENTS.md).
