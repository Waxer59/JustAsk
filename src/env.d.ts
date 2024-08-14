/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly JSEARCH_API_KEY: string
  readonly RAPID_API_HOST: string
  readonly GROQ_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
