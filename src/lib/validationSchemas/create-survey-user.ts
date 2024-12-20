import { z } from 'zod'

export const createSurveyUserSchema = z.object({
  name: z.string(),
  email: z.string().email()
})
