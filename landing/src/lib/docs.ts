import { identity } from '../../../shared/lib/identity'
const routes = {
  overview: '',
  setup: 'getting-started/',
  options: 'reference/configuration/',
  api: 'reference/api/',
  lifecycle: 'reference/configuration/',
  accessibility: '',
  examples: 'guides/examples/',
  changelog: 'changelog/',
} as const
export type DocsRoute = keyof typeof routes
/** Docs URL of one of the template's standard articles. */
export const docsHref = (route: DocsRoute) => identity.docsHome + routes[route]
