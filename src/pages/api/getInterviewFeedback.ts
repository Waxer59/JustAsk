import { LANGUAGE_TEXT } from '@/constants'
import { createFeedbackPrompt } from '@/helpers/createFeedbackPrompt'
import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'
import type { APIRoute } from 'astro'
import { z } from 'zod'

const EXAMPLE_OUTPUT_TRANSLATED = {
  en: {
    question: 'Question',
    evaluation: 'Evaluation',
    feedback: 'Feedback',
    improve: 'What to improve',
    idealResponse: 'Ideal Response',
    explanation: 'Explanation',
    score: 'Score'
  },
  es: {
    question: 'Pregunta',
    evaluation: 'Evaluación',
    feedback: 'Retroalimentación',
    improve: 'Qué mejorar',
    idealResponse: 'Respuesta ideal',
    explanation: 'Explicación',
    score: 'Puntuación'
  }
}

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: import.meta.env.GROQ_API_KEY
})

const bodySchema = z.object({
  offer: z.object({
    title: z.string(),
    description: z.string()
  }),
  interviewQuestions: z.string().array(),
  interviewResponses: z.string().array(),
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

  const { language, interviewQuestions, interviewResponses, offer } =
    parsedBody.data

  const languageText = LANGUAGE_TEXT[language]
  const exampleOutputTranslated = EXAMPLE_OUTPUT_TRANSLATED[language]

  try {
    const { toolResults } = await generateText({
      model: groq('gemma2-9b-it'),
      prompt: `Your task is to evaluate a set of interview questions and responses provided by a candidate using the criteria below. You will provide feedback for each question in markdown format and an overall score separately.

      The criteria for evaluation are:

      1. Relevance: Does the response address the question directly and appropriately?
      2. Accuracy: Is the information provided by the candidate correct and precise?
      3. Clarity: Is the response clear and easy to understand?
      4. Alignment: Does the response align with the job requirements and the expectations outlined in the job offer?

      For each question in the feedback, you must include the following elements:

      1. Evaluation: Provide a detailed analysis of the candidate’s response. Identify both strengths and weaknesses.
      2. Feedback: Address the candidate directly, as if you are speaking to them.
      3. What to Improve: Clearly specify what the candidate needs to improve in their response. Be specific and actionable.
      4. Ideal Response: Offer an example of what the candidate should have said to better meet the expectations of the interviewer.
      5. Explanation: Explain why the original response was either good or bad. Link this explanation back to the job requirements and the purpose of the interview question.
      6. Score: Assign a score between 0 and 100 based on the overall quality of the response. Be consistent in your scoring criteria.
      Additionally, you must provide an overall score for the entire interview separately from the detailed feedback.

      You will be provided with all the details of the offer so that you can evaluate the responses based on the offer.
      
      IMPORTANT: You will answer in the language: ${languageText}, regardless of the language in which it is speaking to you, you must always answer in this language.

      Example Input:

      - Job Offer Details:
        - Title: Frontend developer
        - Description: Experienced React developer...
      - Interview Questions:
        - Question: Why do you want to work for our company?
        - Answer: I am excited about the opportunity to work for a company with such a strong reputation in the industry.
        ... (all other questions and answers)

      Example Score Output:

      85

      Example Feedback Output:

      ${exampleOutputTranslated.question}: Why do you want to work for our company?

      * ${exampleOutputTranslated.evaluation}: Your answer showed enthusiasm but lacked specific details about the company.
      * ${exampleOutputTranslated.feedback}: It’s great to see your excitement. To make your response stronger, mention specific aspects of the company that align with your career goals.
      * ${exampleOutputTranslated.improve}: Provide concrete reasons that demonstrate your knowledge about the company.
      * ${exampleOutputTranslated.idealResponse}: “I want to work for your company because of your innovative approach to technology and your commitment to employee development, which aligns with my career aspirations.”
      * ${exampleOutputTranslated.explanation}: This response is more aligned with the job requirements and shows genuine interest in the company.
      * ${exampleOutputTranslated.score}: 70/100

      ... more feedback for each question ...

      ---

      User input:

      ${createFeedbackPrompt({ offer, interviewQuestions, interviewResponses })}
        `,
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
