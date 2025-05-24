import { createJWT } from '@/lib/jwt'
import { getAgentFeedback } from '@/services/rag'
import type { APIRoute } from 'astro'
import { z } from 'astro:content'

const schema = z.object({
  context: z.string()
})

export const POST: APIRoute = async ({ locals, request }) => {
  const { user } = locals

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await request.json()

  const { error } = schema.safeParse(body)

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 400 })
  }

  const jwtToken = createJWT({
    user_id: user.id
  })

  const feedback = await getAgentFeedback(body.context, jwtToken)

  if (!feedback || !feedback.feedback) {
    return new Response(JSON.stringify({ error: 'No feedback' }), {
      status: 400
    })
  }

  return new Response(JSON.stringify(feedback), { status: 200 })
}
