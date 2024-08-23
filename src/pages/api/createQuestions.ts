import type { APIRoute } from 'astro'
import { z } from 'zod'
import { generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { createQuestionsPrompt } from '@/helpers/createQuestionsPrompt'
import { documentToText } from '@helpers/documentToText'
import { LANGUAGE_TEXT } from '@constants'

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

  const { documents, offer, interviewStyle, additionalInfo, language } =
    parsedBody.data

  const languageText = LANGUAGE_TEXT[language]

  try {
    const imagesPromises =
      documents?.map(async (document) => {
        const buffer = Buffer.from(document, 'base64')
        const text = await documentToText(buffer)
        return text
      }) ?? []

    const resolvedImages = await Promise.all(imagesPromises)
    const { toolResults } = await generateText({
      model: groq('gemma2-9b-it'),
      prompt: `Your task is to generate a specific set of tailored interview questions for each job offer.
        Follow these steps:
        
        1. Review the job description: Understand the role's requirements, responsibilities, and desired qualifications.
        2. Determine the interview style: Note whether the interview will be technical, behavioral, or another style.
        3. Review provided documents (if any): Analyze any CVs, SWOT analyses, or other relevant materials that have been provided.
        4. Generate questions:
            - Create questions that relate to the job description and the provided documents.
            - Include a mix of technical, behavioral, and general questions.
            - Adapt and refine your questions based on any new information provided by the candidate during the interview.
        5. Language considerations:
           *. All responses and questions must be in ${languageText}
        6. Do not engage in any other conversation or activities outside of generating interview questions.
        Example Structure:

        - Job Description:
          * Title: ... insert title here ...
          * Description: ... insert description here ...
        - Interview Style: 
          * ... insert interview style here ...
        - Additional Information (if any):
           ... insert additional info here ...
        - Documents Provided (if any):
           ... insert documents content here ...
    
        Use this structure and guidelines to generate tailored interview questions in the correct language.
        
        ---
        
        ${createQuestionsPrompt({
          title: offer.title.replace(/\s+/g, ' '),
          description: offer.description.replace(/\s+/g, ' '),
          interviewStyle,
          additionalInfo,
          filesContent: resolvedImages
        })}
        `,
      toolChoice: 'required',
      tools: {
        generateQuestions: {
          description: 'Use this to give all interview questions',
          parameters: z.object({
            questions: z
              .string()
              .array()
              .min(10)
              .describe('Interview questions')
          }),
          execute: async ({ questions }) => ({ questions })
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
  } catch (error) {
    console.error(error)
    return new Response(null, {
      status: 500
    })
  }
}
