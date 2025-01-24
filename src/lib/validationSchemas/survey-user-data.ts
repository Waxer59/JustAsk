import { z } from 'zod'

export const surveyUserDataSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'El nombre no puede estar vacío' })
    .toLowerCase(),
  email: z.string().trim().email({ message: 'E-mail inválido' }).toLowerCase()
})
