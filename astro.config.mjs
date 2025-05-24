import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel'
import react from '@astrojs/react'
import { defaultLang, languages } from './src/i18n/ui'
import sitemap from '@astrojs/sitemap'
import { cannonicalURL } from './src/constants/seo'

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  vite: {
    optimizeDeps: {
      exclude: ['scribe.js-ocr']
    },
    worker: {
      format: 'es'
    }
  },
  output: 'server',
  site: cannonicalURL,
  adapter: vercel(),
  integrations: [tailwind({
    applyBaseStyles: false
  }), react(), sitemap(), mdx()],
  devToolbar: {
    enabled: false
  },
  i18n: {
    defaultLocale: defaultLang,
    locales: Object.keys(languages),
    routing: {
      prefixDefaultLocale: false
    }
  },
  security: {
    checkOrigin: true
  }
})