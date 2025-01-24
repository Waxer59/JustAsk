import type { APIRoute } from 'astro'
import { z } from 'zod'
import { generateText } from 'ai'
import { createGroq } from '@ai-sdk/groq'
import { getSurveyByCode } from '@/db/services/survey'
// import { isHmacValid } from '@/lib/hmac'
import { evaluateSurveyPrompt } from '@/helpers/prompts/evaluateSurveyPrompt'
import { createSurveyResult } from '@/db/services/surveyResult'
import { findOrCreateSurveyUser } from '@/db/services/surveyUser'
import { LANGUAGE_TEXT } from '@/constants'

const groq = createGroq({
  apiKey: import.meta.env.GROQ_API_KEY
})

const bodySchema = z.object({
  questions: z
    .object({
      question: z.string(),
      answer: z.string()
    })
    .array(),
  user: z.object({
    name: z.string(),
    email: z.string()
  }),
  // key: z.string(),
  // timestamp: z.number(),
  isAttempt: z.boolean()
})

export const POST: APIRoute = async ({ request, params }) => {
  const { code } = params

  const body = await request.json()

  const { error, data } = bodySchema.safeParse(body)

  if (error) {
    return new Response(JSON.stringify(error), {
      status: 400
    })
  }

  // const allQuestions = data.questions.map(({ question }) => question)

  // const isKeyValid = isHmacValid(
  //   JSON.stringify({ payload: allQuestions, timestamp: data.timestamp }),
  //   data.key
  // )

  // if (!isKeyValid) {
  //   return new Response(null, {
  //     status: 401
  //   })
  // }

  try {
    const survey = await getSurveyByCode(code!)

    if (!survey) {
      return new Response(null, {
        status: 404
      })
    }

    const languageText = LANGUAGE_TEXT[survey?.lang ?? 'es']

    const { toolResults } = await generateText({
      model: groq('gemma2-9b-it'),
      prompt: evaluateSurveyPrompt({
        jobTitle: survey.title,
        jobDescription: survey.description ?? '',
        jobAditionalInfo: survey.offerAdditionalInfo ?? '',
        JobStyle: survey.offerStyle,
        questions: data.questions,
        lang: languageText
      }),
      toolChoice: 'required',
      tools: {
        generateQuestions: {
          description: 'Use this to give the interview evaluation',
          parameters: z.object({
            softSkillsScore: z
              .number()
              .min(0)
              .max(10)
              .describe('Soft Skills Score'),
            hardSkillsScore: z
              .number()
              .min(0)
              .max(10)
              .describe('Hard Skills Score'),
            overallScore: z.number().min(0).max(10).describe('Overall Score'),
            category: z
              .string()
              .describe('Category of the candidate')
              .optional(),
            feedback: z.string().describe('Feedback for the candidate')
          }),
          execute: async (result) => result
        }
      }
    })

    const {
      category,
      softSkillsScore,
      hardSkillsScore,
      overallScore,
      feedback
    } = toolResults[0].result

    const surveyUser = await findOrCreateSurveyUser(survey.id, {
      name: data.user.name,
      email: data.user.email
    })

    await createSurveyResult(
      survey.id,
      surveyUser!.id!,
      category,
      softSkillsScore,
      hardSkillsScore,
      overallScore,
      JSON.stringify(data.questions),
      data.isAttempt
    )

    return new Response(
      JSON.stringify({
        feedback,
        success: true
      }),
      {
        status: 200
      }
    )
  } catch (error) {
    console.error(error)
    return new Response(null, {
      status: 500
    })
  }
}
