import type { APIRoute } from 'astro'
import { z } from 'zod'
import { generateText } from 'ai'
// import { LANGUAGE_TEXT } from '@constants'
import { createGroq } from '@ai-sdk/groq'
// import { getSurveyByCode } from '@/db/services/survey'
import { isHmacValid } from '@/lib/hmac'

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
  key: z.string(),
  timestamp: z.number()
})

export const POST: APIRoute = async ({ request }) => {
  //   const { code } = params

  const body = await request.json()

  const { error, data } = bodySchema.safeParse(body)

  if (error) {
    return new Response(JSON.stringify(error), {
      status: 400
    })
  }

  const allQuestions = data.questions.map(({ question }) => question)

  const isKeyValid = isHmacValid(
    JSON.stringify({ payload: allQuestions, timestamp: data.timestamp }),
    data.key
  )

  if (!isKeyValid) {
    return new Response(null, {
      status: 401
    })
  }

  try {
    // const survey = await getSurveyByCode(code!)

    // const languageText = LANGUAGE_TEXT[survey?.lang ?? 'es']

    const { toolResults } = await generateText({
      model: groq('gemma2-9b-it'),
      prompt: 'TODO',
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
            overallScore: z.number().min(0).max(100).describe('Overall Score'),
            category: z
              .string()
              .describe('Category of the candidate')
              .optional()
          }),
          execute: async (result) => result
        }
      }
    })

    const { category, softSkillsScore, hardSkillsScore, overallScore } =
      toolResults[0].result

    console.log({ category, softSkillsScore, hardSkillsScore, overallScore })

    return new Response(
      JSON.stringify({
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
