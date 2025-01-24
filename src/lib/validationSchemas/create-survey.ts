import { INTERVIEW_LANGUAGES } from '@/constants'
import { z } from 'zod'

export const createSurveySchema = z.object({
  title: z.string(),
  description: z.string(),
  lang: z.enum(INTERVIEW_LANGUAGES),
  offerStyle: z.string(),
  offerTitle: z.string(),
  offerDescription: z.string(),
  offerAdditionalInfo: z.string().optional(),
  numberOfSoftSkillsQuestions: z.number().default(3),
  numberOfHardSkillsQuestions: z.number().default(3),
  customQuestions: z.string().array().default([]),
  categories: z
    .object({
      name: z.string(),
      description: z.string()
    })
    .array()
    .default([]),
  documents: z
    .object({
      name: z.string(),
      description: z.string(),
      isActive: z.boolean().default(false),
      isOptional: z.boolean().default(false)
    })
    .array()
    .default([]),
  maxAttempts: z.number().min(0).default(2),
  maxSubmissions: z.number().min(1).default(1)
})
