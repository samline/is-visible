// The page identity used by SEO, install commands, footer links and skills.
// Every page describes the configured package; `home` and `docsHome` are
// where its Home and Docs start.
import { project } from './project.mjs'

export const identity = {
  ...project,
  home: project.base,
  docsHome: project.docsBase,
}

export type Identity = typeof identity
