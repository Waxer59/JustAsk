import { getInterviewFeedbackPrompt } from '@/helpers/prompts/getInterviewFeedbackPrompt'
import { LANGS } from '@/i18n/ui'
import { createGroq } from '@ai-sdk/groq'
import { generateText } from 'ai'
import type { APIRoute } from 'astro'
import { z } from 'zod'

const groq = createGroq({
  apiKey: import.meta.env.GROQ_API_KEY
})

const bodySchema = z.object({
  offer: z.object({
    title: z.string(),
    description: z.string()
  }),
  interviewQuestions: z.string().array(),
  interviewResponses: z.string().array(),
  language: z.enum([LANGS.es, LANGS.en])
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

  const { language, interviewQuestions, interviewResponses, offer } =
    parsedBody.data

  try {
    const { toolResults } = await generateText({
      model: groq('gemma2-9b-it'),
      prompt: getInterviewFeedbackPrompt({
        language,
        offer,
        interviewQuestions,
        interviewResponses
      }),
      toolChoice: 'required',
      tools: {
        giveFeedback: {
          description:
            'Use this tool to provide feedback and score a job offer',
          parameters: z.object({
            feedback: z
              .string()
              .describe('Job interview feedback in markdown format'),
            score: z
              .number()
              .describe(
                'Score from 0 to 100 to evaluate how the candidate performed the interview'
              )
          }),
          execute: async ({ feedback, score }) => ({
            evaluation: {
              feedback,
              score
            }
          })
        }
      }
    })

    const evaluation = toolResults[0].result.evaluation

    return new Response(JSON.stringify({ evaluation }), {
      status: 200
    })
  } catch (error) {
    console.error(error)
    return new Response(null, {
      status: 500
    })
  }
}
