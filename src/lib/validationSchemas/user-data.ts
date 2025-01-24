import { z } from 'zod'

export const userDataSchema = z.object({
  name: z.string(),
  email: z.string().email()
})
