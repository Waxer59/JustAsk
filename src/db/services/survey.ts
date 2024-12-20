import { db } from '@/db'
import {
  survey,
  surveyCategory,
  surveyDocument,
  surveysToSurveyCategories,
  surveysToSurveysDocuments
} from '@/db/schemas/survey-schema'
import { createSurveySchema } from '@/lib/validationSchemas/create-survey'
import type { Survey, UpdateSurvey } from '@/types'
import { createId } from '@paralleldrive/cuid2'
import { relations, sql } from 'drizzle-orm'

type NewSurvey = typeof survey.$inferInsert
type NewCategory = typeof surveyCategory.$inferInsert
type NewDocument = typeof surveyDocument.$inferInsert

export const surveyRelations = relations(survey, ({ many }) => ({
  surveyToCategories: many(surveysToSurveyCategories),
  surveyToDocuments: many(surveysToSurveysDocuments)
}))

export const createSurvey = async (
  userId: string,
  createSurvey: Omit<Survey, 'id'>
): Promise<{
  survey: NewSurvey
  categories: NewCategory[]
  documents: NewDocument[]
} | null> => {
  const { error, data } = createSurveySchema.safeParse(createSurvey)

  if (error) {
    return null
  }

  const result = await db.transaction(async (tx) => {
    let newSurvey: NewSurvey
    let newCategories: NewCategory[] = []
    let newDocuments: NewDocument[] = []

    try {
      newSurvey = (
        await tx
          .insert(survey)
          .values({
            title: data.title,
            description: data.description,
            lang: data.lang,
            offerStyle: data.offerStyle,
            offerTitle: data.offerTitle,
            offerDescription: data.offerDescription,
            offerAdditionalInfo: data.offerAdditionalInfo,
            numberOfSoftSkillsQuestions: data.numberOfSoftSkillsQuestions,
            numberOfHardSkillsQuestions: data.numberOfHardSkillsQuestions,
            customQuestions: data.customQuestions,
            userId
          })
          .returning()
      )[0]

      if (data.categories.length > 0) {
        newCategories = await tx
          .insert(surveyCategory)
          .values(
            data.categories.map((category) => ({
              name: category.name,
              description: category.description
            }))
          )
          .returning()

        // Insert into junction table
        const surveysToSurveyCategoriesData = newCategories.map((category) =>
          tx.insert(surveysToSurveyCategories).values({
            surveyId: newSurvey.id,
            surveyCategoryId: category.id
          })
        )

        await Promise.all(surveysToSurveyCategoriesData)
      }

      if (data.documents.length > 0) {
        newDocuments = await tx
          .insert(surveyDocument)
          .values(
            data.documents.map((document) => ({
              name: document.name,
              description: document.description
            }))
          )
          .returning()

        // Insert into junction table
        const surveysToSurveyDocuments = newDocuments.map((document) =>
          tx.insert(surveysToSurveysDocuments).values({
            surveyId: newSurvey.id,
            surveyDocumentId: document.id
          })
        )

        await Promise.all(surveysToSurveyDocuments)
      }

      return {
        survey: newSurvey,
        categories: newCategories,
        documents: newDocuments
      }
    } catch (error) {
      console.error(error)
      tx.rollback()
      return null
    }
  })

  return result
}

export const updateSurvey = async (
  surveyId: string,
  updateSurvey: UpdateSurvey
) => {
  const { error } = createSurveySchema.partial().safeParse(updateSurvey)

  if (error) {
    return null
  }

  // TODO
}

export const getSurveyByShareCode = async (shareCode: string) => {
  const findSurvey = await db
    .select()
    .from(survey)
    .where(sql`shareCode = ${shareCode}`)

  return findSurvey.length > 0 ? findSurvey[0] : null
}

export const deleteSurvey = async (userId: string, surveyId: string) => {
  return await db
    .delete(survey)
    .where(sql`userId = ${userId} AND id = ${surveyId}`)
}

export const getAllUserSurveys = async (userId: string) => {
  return await db.query.survey.findMany({
    with: {
      surveyToCategories: true,
      surveyToDocuments: true
    },
    where: (survey, { eq }) => eq(survey.userId, userId)
  })
}

export const createShareSurvey = async (surveyId: string, userId: string) => {
  let shareCode

  do {
    shareCode = createId()
  } while ((await getSurveyByShareCode(shareCode)) !== null)

  const newSurvey = await db
    .update(survey)
    .set({
      shareCode
    })
    .where(sql`id = ${surveyId} AND userId = ${userId}`)

  return newSurvey
}
