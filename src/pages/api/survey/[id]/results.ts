import { getUserSurveyResults } from '@/db/services/surveyResult'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ params, locals }) => {
  const { id } = params
  const { user } = locals

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!id) {
    return new Response('Invalid survey id', { status: 400 })
  }

  const results = await getUserSurveyResults(user.id, id)

  if (!results) {
    return new Response('Survey not found', { status: 404 })
  }

  return new Response(JSON.stringify({ results }), { status: 200 })
}
