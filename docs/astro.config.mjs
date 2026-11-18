import { defineConfig } from 'astro/config'
import tailwind from '@tailwindcss/vite'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import { unified } from '@astrojs/markdown-remark'
import accessibleOverflow from './scripts/rehype-accessible-code.mjs'
import { codeTheme } from '../shared/lib/code-theme.mjs'
import { inlineSmallStylesheets } from '../shared/lib/site-build.mjs'
import { project } from '../shared/lib/project.mjs'
import { siteAliases } from '../shared/lib/aliases.mjs'
export default defineConfig({
  site: project.origin,
  base: project.docsBase.slice(0, -1),
  output: 'static',
  trailingSlash: 'always',
  i18n: { defaultLocale: 'en', locales: ['en'], routing: { prefixDefaultLocale: false } },
  integrations: [mdx(), sitemap()],
  devToolbar: { enabled: false },
  vite: {
    // `@package-site/...` resolves to the site's custom previews (site/).
    resolve: { alias: siteAliases },
    plugins: [tailwind()],
    build: { assetsInlineLimit: inlineSmallStylesheets },
  },
  markdown: {
    processor: unified({ rehypePlugins: [accessibleOverflow] }),
    syntaxHighlight: 'shiki',
    shikiConfig: { theme: codeTheme },
  },
})
