import { createSurvey, getAllUserSurveys } from '@/db/services/survey'
import { createSurveySchema } from '@/lib/validationSchemas/create-survey'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ locals }) => {
  const { user } = locals

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const surveys = await getAllUserSurveys(user.id)

  return new Response(JSON.stringify({ surveys }), { status: 200 })
}

export const POST: APIRoute = async ({ locals, request }) => {
  const { user } = locals

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await request.json()

  const { error } = createSurveySchema.safeParse(body)

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 400 })
  }

  const survey = await createSurvey(user.id, body)

  return new Response(JSON.stringify({ survey }), { status: 200 })
}
