import type { APIRoute } from 'astro'
import { z } from 'zod'

export const prerender = false

const bodySchema = z.object({
  offer: z.object({
    title: z.string(),
    description: z.string()
  }),
  interviewQuestions: z.string().array(),
  interviewResponses: z.string().array(),
  language: z.string()
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

  return new Response(
    JSON.stringify({
      message: 'Success'
    }),
    {
      status: 200
    }
  )
}
