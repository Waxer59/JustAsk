import { db } from '@/db'
import {
  surveyUser,
  surveyUsersToSurveys
} from '@/db/schemas/survey-user-schema'
import { createSurveyUserSchema } from '@/lib/validationSchemas/create-survey-user'
import type { CreateSurveyUser } from '@/types'
import { sql } from 'drizzle-orm'

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
  await db.delete(surveyUser).where(sql`id = ${userId}`)
}
