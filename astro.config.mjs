import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import netlify from '@astrojs/netlify';
import react from '@astrojs/react'
import { defaultLang, languages } from './src/i18n/ui';

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  adapter: netlify(),
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    react()
  ],
  devToolbar: {
    enabled: false
  },
  i18n: {
    defaultLocale: defaultLang,
    locales: Object.keys(languages),
    routing: {
      prefixDefaultLocale: false
    }
  }
})
