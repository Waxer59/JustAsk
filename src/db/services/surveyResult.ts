import { db } from '..'

export const getAllResultsBySurveyId = async (surveyId: string) => {
  try {
    const results = await db.query.surveyResult.findMany({
      where: (surveyResult, { eq }) => eq(surveyResult.surveyId, surveyId)
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
