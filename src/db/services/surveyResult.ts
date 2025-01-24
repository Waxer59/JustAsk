import { db } from '@/db'
import { surveyResult, surveyResultToSurveyUser } from '../schemas'

export const createSurveyResult = async (
  surveyId: string,
  surveyUserId: string,
  category: string,
  scoreSoftSkills: number,
  scoreHardSkills: number,
  overallScore: number,
  surveyLog: string,
  isAttempt: boolean
) => {
  try {
    const result = await db.transaction(async (tx) => {
      const newResult = await tx
        .insert(surveyResult)
        .values({
          surveyId,
          overallScore,
          scoreSoftSkills,
          scoreHardSkills,
          category: 'N/A',
          surveyLog,
          isAttempt
        })
        .returning()

      await tx.insert(surveyResultToSurveyUser).values({
        surveyResultId: newResult[0].id,
        surveyUserId
      })

      return newResult
    })

    return result
  } catch (error) {
    console.log(error)
  }
}

export const getAllResultsBySurveyId = async (surveyId: string) => {
  try {
    const results = await db.query.surveyResult.findMany({
      where: (surveyResult, { eq }) => eq(surveyResult.surveyId, surveyId),
      with: {
        surveyResultToSurveyUser: {
          with: {
            surveyUser: true
          }
        }
      }
    })

    return results
  } catch (error) {
    console.log(error)
  }

  return []
}

export const getUserSurveyResults = async (
  userId: string,
  surveyId: string
) => {
  try {
    const userSurveys = await db.query.surveyUsersToSurveys.findMany({
      where: (surveyUser, { eq }) =>
        eq(surveyUser.surveyId, surveyId) && eq(surveyUser.surveyUserId, userId)
    })

    const surveysIds = userSurveys.reduce((acc, { surveyId }) => {
      if (surveyId) {
        acc.push(surveyId)
      }

      return acc
    }, [] as string[])

    const results = await db.query.surveyResult.findMany({
      where: (surveyResult, { inArray }) => inArray(surveyResult.id, surveysIds)
    })

    return results
  } catch (error) {
    console.log(error)
  }

  return []
}
