import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import netlify from '@astrojs/netlify';
import react from '@astrojs/react'

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
  }
})
