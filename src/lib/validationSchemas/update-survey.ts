import { z } from 'zod'
import { createSurveySchema } from './create-survey'

export const updateSurveySchema = createSurveySchema.merge(
  z.object({
    shareCode: z.string().optional().nullable()
  })
)
