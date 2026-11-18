import sections from './sections'
import { footerCredit } from '../../../../../shared/lib/site-identity.mjs'
import common from '../../../../../shared/i18n/translations/en/common'
import controls from '../../../../../shared/i18n/translations/en/controls'
import { project } from '../../../../../shared/lib/project.mjs'

type Named = { name: string; description: string; credit: string }

/** Navigation copy for the package. */
export const navigationFor = (project: Named) =>
  ({
    mainLabel: 'Main navigation',
    skipContent: 'Skip to content',
    mobile: {
      title: `Explore ${project.name}`,
      introduction: 'A starting point, a working example, and the details when you need them.',
      resources: 'Around the project',
      label: 'Mobile navigation',
      open: 'Open navigation menu',
      close: 'Close navigation menu',
    },
    footer: {
      description: project.description,
      label: 'Footer navigation',
      explore: 'Explore',
      project: 'Project',
      setup: 'Installation guide',
      examples: 'Working examples',
      skill: `${project.name} skill for AI agents`,
      changelog: 'Changelog',
      backToTop: 'Back to top',
      credit: footerCredit(project.credit),
    },
    items: [
      {
        href: '#features',
        // Short labels keep the header on one row at 1024px with the long npm name.
        label: 'About',
        description: 'Understand the problem and the approach.',
      },
      {
        href: '#how',
        label: 'Install',
        description: 'Choose your setup and follow the first steps.',
      },
      {
        href: '#recipes',
        label: 'Recipes',
        description: 'Useful patterns and integration context.',
      },
      { href: '#faq', label: 'FAQ', description: 'Find the practical details.' },
      { page: 'examples', label: 'Examples', description: 'Try a preview and explore its code.' },
      {
        docsRoute: 'overview',
        label: 'Docs',
        description: 'Read guides and the complete reference.',
      },
    ],
  }) as const

/** Examples page copy for one identity. */
export const examplesFor = (project: Named) =>
  ({
    exploreAction: 'Try the example',
    installAction: 'Installation guide',
    eyebrow: 'Examples',
    title: `${project.name} examples.`,
    // Document metadata is separate from the display heading and its period.
    seoTitle: 'Examples',
    seoDescription: `Try live ${project.name} previews of distinct scenarios, then copy separate HTML, CSS and JavaScript files or one complete runnable document.`,
    accent: 'examples.',
    description:
      'Live previews of distinct scenarios, each with independently copyable files. The same examples appear in the documentation.',
    possibilities:
      'These examples show a few possibilities. The next ideas are yours: combine the package’s capabilities with your own content, design and interactions to create the experience your project needs.',
    guide: 'Read the example guide',
    navigation: 'Choose an example',
    accessibility:
      'Each preview runs the real package. The copied files load the published browser bundle, so they run as they are.',
    skill: `Download the ${project.name} skill for AI agents`,
  }) as const

export default {
  sections,
  common,
  controls,
  navigation: navigationFor(project),
  examples: examplesFor(project),
} as const
