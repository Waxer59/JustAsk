import { db } from '@/db'
import {
  surveyUser,
  surveyUsersToSurveys
} from '@/db/schemas/survey-user-schema'
import { createSurveyUserSchema } from '@/lib/validationSchemas/create-survey-user'
import type { CreateSurveyUser } from '@/types'
import { sql } from 'drizzle-orm'
import type { UserSurveyData } from '../types'
import { getSurveyByShareCode } from './survey'
import { getUserSurveyResults } from './surveyResult'

type NewSurveyUser = typeof surveyUser.$inferInsert

export const createSurveyUser = async (
  surveyId: string,
  newSurveyUser: CreateSurveyUser
): Promise<NewSurveyUser | null> => {
  const { error, data } = createSurveyUserSchema.safeParse(newSurveyUser)

  if (error) {
    return null
  }

  try {
    // Check if user already exists
    let user = await db
      .select()
      .from(surveyUser)
      .where(sql`email = ${data.email}`)

    // If user doesn't exist, create it
    if (user.length === 0) {
      user = await db
        .insert(surveyUser)
        .values({
          name: data.name,
          email: data.email
        })
        .returning()

      // Insert into junction table
      await db.insert(surveyUsersToSurveys).values({
        surveyId,
        surveyUserId: user[0].id
      })
    }

    return user[0]
  } catch (error) {
    console.log(error)
  }

  return null
}

export const deleteSurveyUser = async (userId: string): Promise<void> => {
  try {
    await db.delete(surveyUser).where(sql`id = ${userId}`)
  } catch (error) {
    console.log(error)
  }
}

export const getUserSurveyData = async (
  userId: string,
  surveyCode: string
): Promise<UserSurveyData | null> => {
  const survey = await getSurveyByShareCode(surveyCode)

  if (!survey) {
    return null
  }

  const userSurveyResults = await getUserSurveyResults(userId, survey.id)

  const attempts = userSurveyResults.reduce((acc, { isAttempt }) => {
    if (isAttempt) {
      acc++
    }

    return acc
  }, 0)

  const submissions = userSurveyResults.length - attempts

  return {
    attempts,
    submissions
  }
}
