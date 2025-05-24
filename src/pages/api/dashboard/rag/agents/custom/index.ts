import { createJWT } from '@/lib/jwt'
import { createRagAgent } from '@/services/rag'
import type { APIRoute } from 'astro'
import { z } from 'zod'

const bodySchema = z.object({
  agent_name: z.string().min(1, { message: '' }),
  agent_description: z.string().optional(),
  agent_action: z.string().min(1, { message: '' })
})

export const POST: APIRoute = async ({ locals, request }) => {
  const { user } = locals

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

  const agent = await createRagAgent(
    body.agent_name,
    body.agent_description,
    body.agent_action,
    jwtToken
  )

  if (!agent) {
    return new Response(JSON.stringify({ error: 'No agent' }), {
      status: 400
    })
  }

  return new Response(JSON.stringify(agent), { status: 200 })
}
