import { createJWT } from '@/lib/jwt'
import { getRagQuery } from '@/services/rag'
import type { APIRoute } from 'astro'
import { z } from 'astro:content'

const schema = z.object({
  question: z.string()
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

  const resp = await getRagQuery(body.question, jwtToken)

  if (!resp) {
    return new Response(JSON.stringify({ error: 'No response' }), {
      status: 400
    })
  }

  if (resp.status === 'error') {
    return new Response(JSON.stringify({ error: resp.message }), {
      status: 400
    })
  }

  return new Response(JSON.stringify(resp), { status: 200 })
}
