/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly JSEARCH_API_KEY: string
  readonly RAPID_API_HOST: string
  readonly GROQ_API_KEY: string
  readonly AUTH_RESEND_KEY: string
  readonly BETTER_AUTH_SECRET: string
  readonly HMAC_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare namespace App {
  // Note: 'import {} from ""' syntax does not work in .d.ts files.
  interface Locals {
    user: import('better-auth').User | null
    session: import('better-auth').Session | null
  }
}
