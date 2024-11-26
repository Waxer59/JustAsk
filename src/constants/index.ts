export const ALLOWED_FILE_MIME_TYPES = [
  'image/bmp',
  'image/jpeg',
  'image/png',
  'image/pbm',
  'image/webp',
  'application/pdf'
]

export enum LANG_CODES {
  en = 'en-US',
  es = 'es-ES'
}

export const NUMBER_OF_INTERVIEW_QUESTIONS = 5

export const LANGUAGE_TEXT = {
  es: 'español',
  en: 'english'
}

export const CONFETTI_DURATION = 1.5 * 1000 // ms
export const CONFETTI_DEFAULTS = {
  startVelocity: 30,
  spread: 360,
  ticks: 60,
  zIndex: 0
}

export const INTERVIEW_LANGUAGES = ['en', 'es'] as const
export const MAX_NUMBER_OF_QUESTIONS = 10
