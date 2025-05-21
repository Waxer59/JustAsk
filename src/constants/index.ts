import { LANGS } from '@/i18n/ui'
import type { Document } from '@/types'

export const ALLOWED_FILE_MIME_TYPES = [
  'image/bmp',
  'image/jpeg',
  'image/png',
  'image/pbm',
  'image/webp',
  'application/pdf',
  'text/plain',
  'text/markdown'
]

export enum LANG_CODES {
  en = 'en-US',
  es = 'es-ES'
}

export const NUMBER_OF_INTERVIEW_QUESTIONS = 5

export const LANGUAGE_TEXT = {
  es: 'español',
  en: 'english'
} as const

export const CONFETTI_DURATION = 1.5 * 1000 // ms
export const CONFETTI_DEFAULTS = {
  startVelocity: 30,
  spread: 360,
  ticks: 60,
  zIndex: 0
}

export const INTERVIEW_LANGUAGES = [LANGS.en, LANGS.es] as const
export const MAX_NUMBER_OF_QUESTIONS = 10

export const PRIVATE_ROUTES = ['/dashboard']

export const DEFAULT_DOUMENTS: Record<string, Document[]> = {
  en: [
    {
      id: 'cv',
      name: 'Curriculum Vitae',
      description: 'Professional resume detailing work experience and skills',
      isActive: true
    },
    {
      id: 'swot',
      name: 'SWOT Analysis',
      description:
        'Analysis of Strengths, Weaknesses, Opportunities, and Threats',
      isActive: true,
      isOptional: true
    }
  ],
  es: [
    {
      id: 'cv',
      name: 'Curriculum Vitae',
      description:
        'Resumen profesional que detalla experiencia laboral y habilidades',
      isActive: true
    },
    {
      id: 'swot',
      name: 'Análisis DAFO',
      description:
        'Análisis de fortalezas, debilidades, oportunidades y amenazas',
      isActive: true,
      isOptional: true
    }
  ]
}

export const DEFAULT_ATTEMPTS = 2
export const DEFAULT_MAX_SUBMISSIONS = 1
export const DEFAULT_HARD_SKILLS_QUESTIONS = 3
export const DEFAULT_SOFT_SKILLS_QUESTIONS = 3
export const DEFAULT_SECONDS_PER_QUESTION = 150 // 2.5 min
export const DEFAULT_NUMBER_OF_ATTEMPT_QUESTIONS = 2

export const PRIVACY_POLICY_VERSION = 1

export const CODE_LENGTH = 8

export const NOT_APLICABLE = 'N/A'

export enum R2Buckets {
  justask = 'justask'
}

export const SILENCE_TIME = 3 * 1000 // 3 sec
