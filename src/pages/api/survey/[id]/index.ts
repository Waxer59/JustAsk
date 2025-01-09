import { deleteSurvey, updateSurvey } from '@/db/services/survey'
import { createSurveySchema } from '@/lib/validationSchemas/create-survey'
import type { APIRoute } from 'astro'

export const DELETE: APIRoute = async ({ params, locals }) => {
  const { id } = params
  const { user } = locals

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!id) {
    return new Response('Invalid survey id', { status: 400 })
  }

  const survey = await deleteSurvey(user.id, id)

  if (!survey) {
    return new Response('Survey not found', { status: 404 })
  }

  return new Response(JSON.stringify(survey), { status: 200 })
}

export const PATCH: APIRoute = async ({ params, locals, request }) => {
  const { id } = params
  const { user } = locals

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!id) {
    return new Response('Invalid survey id', { status: 400 })
  }

  const body = await request.json()
  const { error, data } = createSurveySchema.partial().safeParse(body)

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 400 })
  }

  const survey = await updateSurvey(id, data, user.id)

  if (!survey) {
    return new Response('Survey not found', { status: 404 })
  }

  return new Response(JSON.stringify({ survey }), { status: 200 })
}
