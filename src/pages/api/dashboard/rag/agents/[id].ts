import type { APIRoute } from 'astro'
import { createJWT } from '@lib/jwt'
import { getAgentQuestion } from '@services/rag'
import { z } from 'zod'

const bodySchema = z.object({
  message: z.string().optional()
})

export const POST: APIRoute = async ({ locals, params, request }) => {
  const { user } = locals
  const { id } = params

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await request.json()

  const { error } = bodySchema.safeParse(body)

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 400 })
  }

  const jwtToken = createJWT({
    user_id: user.id
  })
  const question = await getAgentQuestion(id!, jwtToken, body.message)

  if (!question || !question.question) {
    return new Response(null, {
      status: 404
    })
  }

  return new Response(JSON.stringify(question), { status: 200 })
}
