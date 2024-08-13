import type { APIRoute } from 'astro'
import { z } from 'zod'

// const createPrompt = ({ title, description, interviewStyle, additionalInfo }) =>
//   `Eres un experto entrevistador`

const bodySchema = z.object({
  offer: z.object({
    title: z.string(),
    description: z.string()
  }),
  interviewStyle: z.string(),
  documents: z.string().array().optional(),
  additionalInfo: z.string().optional()
})

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json()
  const parsedBody = bodySchema.safeParse(body)

  if (!parsedBody.success) {
    return new Response(
      JSON.stringify({
        error: 'Invalid request body'
      }),
      {
        status: 400
      }
    )
  }

  return new Response(null, {
    status: 500
  })
}
