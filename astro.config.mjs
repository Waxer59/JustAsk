import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import { defaultLang, languages } from './src/i18n/ui';

import sitemap from "@astrojs/sitemap";
import { cannonicalURL } from './src/constants/seo';

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  site: cannonicalURL,
  adapter: netlify(),
  integrations: [tailwind({
    applyBaseStyles: false
  }), react(), sitemap()],
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
});