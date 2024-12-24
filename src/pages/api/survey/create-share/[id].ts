import { createShareSurvey } from '@/db/services/survey'
import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ params, locals }) => {
  const { id } = params
  const { user } = locals

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!id) {
    return new Response('Invalid survey id', { status: 400 })
  }

  const survey = await createShareSurvey(id, user.id)

  if (!survey) {
    return new Response('Survey not found', { status: 404 })
  }

  return new Response(JSON.stringify(survey), { status: 200 })
}
