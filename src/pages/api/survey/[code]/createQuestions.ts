import type { APIRoute } from 'astro'
import { z } from 'zod'
import { generateText } from 'ai'
// import { LANGUAGE_TEXT } from '@constants'
import { createGroq } from '@ai-sdk/groq'
import { shuffleArray } from '@/helpers/shuffleArray'
// import { getSurveyByCode } from '@/db/services/survey'
import { createHmac } from '@/lib/hmac'

const groq = createGroq({
  apiKey: import.meta.env.GROQ_API_KEY
})

export const POST: APIRoute = async () => {
  // const { code } = params

  try {
    // const survey = await getSurveyByCode(code!)

    // const languageText = LANGUAGE_TEXT[survey?.lang ?? 'es']

    const { toolResults } = await generateText({
      model: groq('gemma2-9b-it'),
      prompt: 'TODO',
      toolChoice: 'required',
      tools: {
        generateQuestions: {
          description: 'Use this to give all interview questions',
          parameters: z.object({
            questions: z.string().array().min(5).describe('Interview questions')
          }),
          execute: async ({ questions }) => ({ questions })
        }
      }
    })

    const questions = toolResults[0].result.questions

    const hmac = createHmac(JSON.stringify({ questions }))

    const shuffledQuestions = shuffleArray(questions)

    return new Response(
      JSON.stringify({
        questions: shuffledQuestions,
        ...hmac
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
