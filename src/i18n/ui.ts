import en from './languages/en'
import es from './languages/es'

export const languages = {
  en: 'English',
  es: 'Spanish'
}

export enum LANGS {
  en = 'en',
  es = 'es'
}

export const defaultLang = LANGS.es

export const ui = {
  en,
  es
} as const
