import {
  DEFAULT_ATTEMPTS,
  DEFAULT_HARD_SKILLS_QUESTIONS,
  DEFAULT_MAX_SUBMISSIONS,
  DEFAULT_NUMBER_OF_ATTEMPT_QUESTIONS,
  DEFAULT_SECONDS_PER_QUESTION,
  DEFAULT_SOFT_SKILLS_QUESTIONS,
  INTERVIEW_LANGUAGES
} from '@/constants'
import { z } from 'zod'

export const createSurveySchema = z.object({
  title: z.string(),
  description: z.string(),
  lang: z.enum(INTERVIEW_LANGUAGES),
  offerStyle: z.string(),
  offerTitle: z.string(),
  offerDescription: z.string(),
  offerAdditionalInfo: z.string().optional(),
  numberOfSoftSkillsQuestions: z
    .number()
    .default(DEFAULT_SOFT_SKILLS_QUESTIONS),
  numberOfHardSkillsQuestions: z
    .number()
    .default(DEFAULT_HARD_SKILLS_QUESTIONS),
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
  maxAttempts: z.number().min(0).default(DEFAULT_ATTEMPTS),
  maxSubmissions: z.number().min(1).default(DEFAULT_MAX_SUBMISSIONS),
  secondsPerQuestion: z.number().min(1).default(DEFAULT_SECONDS_PER_QUESTION),
  numberOfAttemptQuestions: z
    .number()
    .min(0)
    .default(DEFAULT_NUMBER_OF_ATTEMPT_QUESTIONS)
})
