import type { APIRoute } from 'astro'
import { z } from 'zod'
import { generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { createQuestionsPrompt } from '@helpers/createQuestionPrompt'
import { documentToText } from '@helpers/documentToText'

export const prerender = false

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: import.meta.env.GROQ_API_KEY
})

const bodySchema = z.object({
  offer: z.object({
    title: z.string(),
    description: z.string()
  }),
  interviewStyle: z.string(),
  documents: z.string().array().optional(),
  additionalInfo: z.string().optional()
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

  const { documents, offer, interviewStyle, additionalInfo } = parsedBody.data

  const imagesPromises =
    documents?.map(async (document) => {
      const buffer = Buffer.from(document, 'base64')
      const text = await documentToText(buffer)
      return text
    }) ?? []

  const resolvedImages = await Promise.all(imagesPromises)

  const { toolResults } = await generateText({
    model: groq('llama-3.1-70b-versatile'),
    messages: [
      {
        role: 'system',
        content: `You are an expert interviewer for a company, specializing in adapting your approach based on the job offer, the required interview style, and the language of the offer. Your primary objective is to generate a specific set of tailored questions for each interview, considering the details of the job offer, the interview style (technical, behavioral, etc.), and any provided documents such as CVs, SWOT analyses, or other relevant materials. Additionally, you should be prepared to adapt and refine your questions based on any new information provided by the candidate during the interview. All responses and questions should be conducted in the language of the job offer.`
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: createQuestionsPrompt({
              title: offer.title.replace(/\s+/g, ' '),
              description: offer.description.replace(/\s+/g, ' '),
              interviewStyle,
              additionalInfo,
              filesContent: resolvedImages
            })
          }
        ]
      }
    ],
    toolChoice: 'required',
    tools: {
      generateQuestions: {
        description: 'Use this to give all interview questions',
        parameters: z.object({
          questions: z.string().array().min(10).describe('Interview questions')
        }),
        execute: async ({ questions }) => {
          return {
            questions: questions
          }
        }
      }
    }
  })

  const questions = toolResults[0].result.questions

  return new Response(
    JSON.stringify({
      questions
    }),
    {
      status: 200
    }
  )
}
