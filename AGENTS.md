# @samline/is-visible

Visibility callbacks for one or many elements on shared intersection observers, for vanilla JavaScript, React, Vue, Svelte and plain HTML.

Package memory: decisions and lessons specific to this package. Family rules are in the block below.

- Extracted from the samline/utils monorepo on 2026-11-14 with its Git history (`git subtree split`).
- The website is embedded from package-landing-docs (`landing/`, `docs/`, `shared/`, `site-tools/`); `site/` holds this package's previews and copyable examples.

<!-- samline:family:start -->

## Family conventions (@samline)

This block is synced from the template that owns the family conventions ([package-landing-docs](https://github.com/samline/package-landing-docs) `family/AGENTS.md`, `node family/scripts/sync.mjs`). Do not edit it here; change the template and re-sync. The skill `.agents/skills/samline-package/SKILL.md` carries the full rules for a repository cloned on its own.

- One package per repository. Framework-agnostic core in JS/CSS/HTML; adapters only when idiomatic, as optional peers.
- No DOM access at import time; without a DOM, calls are no-ops. Respect `prefers-reduced-motion`; content stays visible without JavaScript.
- Arrow functions and closures, no classes or `this`. `destroy()` is idempotent and restores markup.
- Zero runtime dependencies: shared primitives (`@samline/internal`, `@samline/is-visible`, `@samline/debounce`) are devDependencies bundled with `noExternal`.
- Install with pnpm, run with Bun: `pnpm install` / `pnpm add -D` (only `pnpm-lock.yaml` is committed), `bun run <script>` for everything else. Never `bun install`, `bun add`, `npm install` or `yarn`.
- Packages talk through npm only: install the published version of any sibling package. Never link or import a local checkout (`bun link`, `link:`, `file:`, path aliases, `../other-package/src`).
- Layout: `src/core`, `src/vanilla`, `src/browser/global.ts` (`window.<PascalName>`, or a plain non-colliding name such as `Strings` when that is a built-in, never a `Samline` prefix; `dist/browser/<name>.global.js`), side-effect-free `src/index.ts`. Every public entry has a gzip budget in `package.json` → `size`.
- `bun run check` must pass: format, typecheck, unit tests with coverage thresholds, build, size budgets, e2e in Chromium, Firefox and WebKit.
- README is the package guide and the site's source of truth; public text in English. Any public API change updates tests, README, docs, examples and `skills/<name>/SKILL.md` together.
- Releases: Keep a Changelog entry for every user-facing change, semver, pinned CDN URLs bumped before release. Publishing is manual (`bun run release` by the maintainer); CI never publishes; no `--provenance`.
- Public repository: no dated reports, handoff notes, transcripts or client names; private notes go in the ignored `.local/`. Site examples with state offer Reset; icons are SVG, never Unicode glyphs.
- Work skills: `npx autoskills -y -a universal`, tracked with `skills-lock.json`, minus the `bun` skill (it contradicts pnpm installs), plus `modern-web-guidance`, consulted before HTML, CSS or client-side JavaScript work.
- Graph first, Grep last: before exploring, check `codebase-memory-mcp` `index_status` and run `index_repository` if this repository is not indexed. Then explore through the graph (`search_graph`, `trace_path`, `get_code_snippet`, `search_code`); Grep, Glob and whole-file reads are the last resort, for literals, configuration and coverage gaps, because they waste tokens.
- Delegation: the main session leads (plans, decides, owns quality and security) and delegates on its own judgment; the maintainer authorizes these subagents in advance, so never wait to be asked. Search and reading go to `Explore` (Haiku), planned implementation to `implementer` (Sonnet), review of every non-trivial diff to `reviewer` (Sonnet), always by model alias so each resolves to the newest version, defined in `.agents/agents/` (`.claude/agents` points there). Skip delegation only for questions and one-line edits. The lead steps in when an agent loops or is blocked, and verifies every agent report before calling work done.
- Never add AI attribution to commits, tags or pull requests.

<!-- samline:family:end -->
