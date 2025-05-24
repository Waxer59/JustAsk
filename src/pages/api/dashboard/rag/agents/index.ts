import { createJWT } from '@/lib/jwt'
import { getAgents } from '@/services/rag'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ locals, url }) => {
  const { user } = locals
  const lang = url.searchParams.get('lang') ?? 'es'

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const jwtToken = createJWT({
    user_id: user.id
  })

  const agents = await getAgents(lang, jwtToken)

  if (!agents) {
    return new Response(JSON.stringify({ error: 'No agents' }), {
      status: 400
    })
  }

  return new Response(JSON.stringify(agents), { status: 200 })
}
