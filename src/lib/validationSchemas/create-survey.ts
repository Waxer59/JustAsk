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
      description: z.string()
    })
    .array()
    .default([]),
  maxSubmissions: z.number().default(1),
  maxAttempts: z.number().default(3)
})
