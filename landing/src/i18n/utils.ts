import en from './translations/en'
import { createI18n, type TranslationShape } from '../../../shared/i18n/createI18n'
export type TranslationDictionary = TranslationShape<typeof en>
export const dictionaries = { en } satisfies Record<string, TranslationDictionary>
const base = createI18n(dictionaries, 'en')
export const getLocale = base.getLocale

type Dictionary = typeof en
type AstroLike = { currentLocale?: string }

/** The site copy for the page's locale. */
export const getI18n = (astro: AstroLike = {}): Dictionary => base.getI18n(astro) as Dictionary
