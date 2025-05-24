import type { APIRoute } from 'astro'
import { createJWT } from '@lib/jwt'
import { getAgentQuestion } from '@services/rag'

export const GET: APIRoute = async ({ locals, params }) => {
  const { user } = locals
  const { id } = params

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const jwtToken = createJWT({
    user_id: user.id
  })
  const question = await getAgentQuestion(id!, jwtToken)

  if (!question || !question.question) {
    return new Response(null, {
      status: 404
    })
  }

  return new Response(JSON.stringify(question), { status: 200 })
}
