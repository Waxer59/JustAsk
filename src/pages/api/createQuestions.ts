import type { APIRoute } from 'astro'
import { z } from 'zod'
import { generateText } from 'ai'
import { LANGUAGE_TEXT } from '@constants'
import { createGroq } from '@ai-sdk/groq'
import { createQuestionsPrompt } from '@/helpers/prompts/createQuestionsPrompt'
import { shuffleArray } from '@/helpers/shuffleArray'

const groq = createGroq({
  apiKey: import.meta.env.GROQ_API_KEY
})

const bodySchema = z.object({
  offer: z.object({
    title: z.string(),
    description: z.string()
  }),
  interviewStyle: z.string(),
  documentsContent: z.string().array().optional(),
  additionalInfo: z.string().optional(),
  language: z.enum(['es', 'en'])
})

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json()
  const parsedBody = bodySchema.safeParse(body)

  if (!parsedBody.success) {
    return new Response(
      JSON.stringify({
        error: 'Invalid request body'
      }),
      {
        status: 400
      }
    )
  }

  const { documentsContent, offer, interviewStyle, additionalInfo, language } =
    parsedBody.data

  const languageText = LANGUAGE_TEXT[language]

  try {
    const { toolResults } = await generateText({
      model: groq('gemma2-9b-it'),
      prompt: createQuestionsPrompt({
        language: languageText,
        offer,
        interviewStyle,
        additionalInfo,
        documentsContent
      }),
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

    const shuffledQuestions = shuffleArray(questions)

    return new Response(
      JSON.stringify({
        questions: shuffledQuestions
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
