import { developmentRedirect } from '../shared/lib/development-routes.mjs'
import { defineConfig } from 'astro/config'
import tailwind from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'
import { inlineSmallStylesheets } from '../shared/lib/site-build.mjs'
import { project } from '../shared/lib/project.mjs'
import { siteAliases } from '../shared/lib/aliases.mjs'
const development = process.argv.includes('dev')
export default defineConfig({
  site: project.url,
  base: project.base === '/' ? '/' : project.base.slice(0, -1),
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  devToolbar: { enabled: false },
  vite: {
    // `@package-site/...` resolves to the site's custom previews (site/).
    resolve: { alias: siteAliases },
    plugins: [
      tailwind(),
      developmentRedirect({
        origin: `http://127.0.0.1:${project.dev.docsPort}`,
        include: project.docsBase,
      }),
    ],
    build: { assetsInlineLimit: inlineSmallStylesheets },
    define: { 'import.meta.env.BASE_URL': JSON.stringify(project.base) },
  },
})
