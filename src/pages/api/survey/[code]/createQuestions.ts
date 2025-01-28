import type { APIRoute } from 'astro'
import { z } from 'zod'
import { generateText } from 'ai'
import { LANGUAGE_TEXT } from '@constants'
import { createGroq } from '@ai-sdk/groq'
import { shuffleArray } from '@/helpers/shuffleArray'
import { getSurveyByCode } from '@/db/services/survey'
import { createHmac } from '@/lib/hmac'
import { createSurveyQuestionsPrompt } from '@/helpers/prompts/createSurveyQuestionsPrompt'
import { findOrCreateSurveyUser } from '@/db/services/surveyUser'
import { getUserSurveyResults } from '@/db/services/surveyResult'

const groq = createGroq({
  apiKey: import.meta.env.GROQ_API_KEY
})

const bodySchema = z.object({
  documents: z
    .object({
      name: z.string(),
      description: z.string(),
      content: z.string().min(1)
    })
    .array(),
  user: z.object({
    name: z.string(),
    email: z.string()
  }),
  isAttempt: z.boolean()
})

export const POST: APIRoute = async ({ params, request }) => {
  const { code } = params

  const body = await request.json()

  if (!body) {
    return new Response(null, {
      status: 400
    })
  }

  const { error, data } = bodySchema.safeParse(body)

  if (error) {
    return new Response(null, {
      status: 400,
      statusText: error.message
    })
  }

  // TODO: Make sure that the user gives only the documents that are required and not other

  try {
    const survey = await getSurveyByCode(code!)

    if (!survey) {
      return new Response(null, {
        status: 404
      })
    }

    const languageText = LANGUAGE_TEXT[survey?.lang ?? 'es']

    const { name, email } = data.user

    const user = await findOrCreateSurveyUser(survey.id, {
      name,
      email
    })
    const userSurveyResults = await getUserSurveyResults(user!.id!, survey.id)

    const allQuestions = userSurveyResults
      // @ts-expect-error https://orm.drizzle.team/docs/rqb#select-filters
      .map(({ surveyResult }) =>
        surveyResult.surveyLog.map(
          ({ question }: { question: string }) => question
        )
      )
      .flat()

    const { toolResults } = await generateText({
      model: groq('gemma2-9b-it'),
      prompt: createSurveyQuestionsPrompt({
        language: languageText,
        offer: {
          title: survey.offerTitle,
          description: survey.offerDescription!
        },
        interviewStyle: survey.offerStyle,
        additionalInfo: survey?.offerAdditionalInfo ?? undefined,
        documentsContent: data.documents,
        questionsToNotInclude: allQuestions
      }),
      toolChoice: 'required',
      tools: {
        generateQuestions: {
          description: 'Use this to give all interview questions',
          parameters: z.object({
            hardSkillQuestions: z
              .string()
              .array()
              .min(survey.numberOfHardSkillsQuestions!)
              .describe(
                'Provide here technical skills questions to evaluate the technical skills of the candidate'
              ),
            softSkillQuestions: z
              .string()
              .array()
              .min(survey.numberOfSoftSkillsQuestions!)
              .describe(
                'Provide here soft skills questions to evaluate the soft skills of the candidate'
              )
          }),
          execute: async (result) => result
        }
      }
    })

    const { hardSkillQuestions, softSkillQuestions } = toolResults[0].result

    const questions = [
      ...hardSkillQuestions.slice(0, survey.numberOfHardSkillsQuestions!),
      ...softSkillQuestions.slice(0, survey.numberOfSoftSkillsQuestions!)
    ]

    // TODO: In future versions, add the option to decide whether to include custom questions or not
    if (!data.isAttempt) {
      questions.push(...survey.customQuestions!)
    }

    const shuffledQuestions = shuffleArray(questions)

    const questionsToSend = data.isAttempt
      ? shuffledQuestions.slice(0, survey.numberOfAttemptQuestions!)
      : shuffledQuestions

    const hmac = createHmac(JSON.stringify({ questions: questionsToSend }))

    return new Response(
      JSON.stringify({
        questions: questionsToSend,
        secondsPerQuestion: survey.secondsPerQuestion,
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
