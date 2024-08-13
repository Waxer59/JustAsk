/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly JSEARCH_API_KEY: string
  readonly RAPID_API_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
