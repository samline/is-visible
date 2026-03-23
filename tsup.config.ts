import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
      'vanilla/index': 'src/vanilla/index.ts',
      'react/index': 'src/react/index.ts',
      'vue/index': 'src/vue/index.ts',
      'svelte/index': 'src/svelte/index.ts'
    },
    format: ['esm'],
    dts: true,
    target: 'es2020',
    clean: true
  },
  {
    entry: {
      'browser/is-visible': 'src/browser/global.ts'
    },
    format: ['iife'],
    globalName: 'IsVisible',
    platform: 'browser',
    target: 'es2020',
    sourcemap: true,
    splitting: false,
    clean: false
  }
])
