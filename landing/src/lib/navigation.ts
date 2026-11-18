import { identity } from '../../../shared/lib/identity'
import { docsHref, type DocsRoute } from './docs'
type Item = { href: string } | { docsRoute: DocsRoute } | { page: 'examples' }
/** The site Home. */
export const homeHref = () => identity.home
/** The Examples page. */
export const examplesHref = () => `${identity.home}examples/`
export const isHome = (pathname: string) =>
  pathname.replace(/\/$/, '') === homeHref().replace(/\/$/, '')
export const navigationHref = (item: Item, pathname: string): string => {
  if ('docsRoute' in item) return docsHref(item.docsRoute)
  if ('page' in item) return examplesHref()
  return isHome(pathname) ? item.href : `${homeHref()}${item.href}`
}
