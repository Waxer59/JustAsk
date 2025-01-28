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
    const results = await db.query.surveyResultToSurveyUser.findMany({
      where: (surveyResultToSurveyUser, { eq }) =>
        eq(surveyResultToSurveyUser.surveyUserId, userId),
      with: {
        surveyResult: {
          // @ts-expect-error https://orm.drizzle.team/docs/rqb#select-filters
          where: (surveyResult, { eq }) => eq(surveyResult.surveyId, surveyId)
        }
      }
    })

    // @ts-expect-error https://orm.drizzle.team/docs/rqb#select-filters
    return results.filter((result) => result.surveyResult)
  } catch (error) {
    console.log(error)
  }

  return []
}
