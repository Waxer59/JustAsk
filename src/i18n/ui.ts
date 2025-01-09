import en from './languages/en'
import es from './languages/es'

export const languages = {
  en: 'English',
  es: 'Spanish'
}

export const defaultLang = 'es'

export const ui = {
  en,
  es
} as const
