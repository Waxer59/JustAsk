import { getUserSurveyDataByEmail } from '@/db/services/surveyUser'
import { userDataSchema } from '@/lib/validationSchemas/user-data'
import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request, params }) => {
  const { code } = params
  const body = await request.json()

  const { error, data } = userDataSchema.safeParse(body)

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 400 })
  }

  const userSurveyData = await getUserSurveyDataByEmail(
    data.name,
    data.email,
    code!
  )

  if (!userSurveyData) {
    return new Response('Survey not found', { status: 404 })
  }

  return new Response(
    JSON.stringify({
      ...userSurveyData
    }),
    { status: 200 }
  )
}
