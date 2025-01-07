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
import { getAllResultsBySurveyId } from './surveyResult'

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
            maxAttempts: data.maxAttempts,
            maxSubmissions: data.maxSubmissions,
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

export const getSurveyById = async (surveyId: string) => {
  try {
    const result = await db
      .select()
      .from(survey)
      .where(sql`id = ${surveyId}`)

    return result[0]
  } catch (error) {
    console.log(error)
  }

  return null
}

export const updateSurvey = async (
  surveyId: string,
  updateSurvey: UpdateSurvey,
  userId: string
) => {
  // const { error, data } = createSurveySchema.partial().safeParse(updateSurvey)

  // if (error) {
  //   return null
  // }

  // const { categories, documents, ...rest } = data

  const surveyToUpdate = await getSurveyById(surveyId)

  if (!surveyToUpdate || surveyToUpdate.userId !== userId) {
    return null
  }

  // const result = await db.transaction(async (tx) => {
  //   try {
  //     if (data.categories && data.categories.length > 0) {
  //       const existingCategories = await tx
  //         .select()
  //         .from(surveysToSurveyCategories)
  //         .where(sql`surveyId = ${surveyId}`)

  //       const existingCategoryIds = existingCategories.map(
  //         ({ surveyCategoryId }) => surveyCategoryId
  //       )

  //       await tx.delete(surveysToSurveyCategories).where(
  //         sql`surveyId = ${surveyId} AND surveyCategoryId IN ${existingCategoryIds}`
  //       )
  //     }

  //     if (data.documents && data.documents.length > 0) {
  //     }

  //     await tx
  //       .update(survey)
  //       .set({
  //         ...rest
  //       })
  //       .where(sql`id = ${surveyId}`)

  //     const newSurvey = await tx.query.survey.findMany({
  //       where: (survey, { eq }) => eq(survey.id, surveyId),
  //       with: {
  //         surveyToCategories: true,
  //         surveyToDocuments: true
  //       }
  //     })

  //     return newSurvey[0]
  //   } catch (error) {
  //     console.log(error)
  //     tx.rollback()
  //   }
  // })
}

export const getSurveyByShareCode = async (shareCode: string) => {
  try {
    const findSurvey = await db
      .select()
      .from(survey)
      .where(sql`shareCode = ${shareCode}`)

    return findSurvey.length > 0 ? findSurvey[0] : null
  } catch (error) {
    console.log(error)
  }

  return null
}

export const deleteSurvey = async (userId: string, surveyId: string) => {
  try {
    return await db
      .delete(survey)
      .where(sql`userId = ${userId} AND id = ${surveyId}`)
  } catch (error) {
    console.log(error)
  }

  return null
}

export const getAllUserSurveys = async (userId: string) => {
  try {
    const surveys = await db.query.survey.findMany({
      with: {
        surveyToCategories: true,
        surveyToDocuments: true
      },
      where: (survey, { eq }) => eq(survey.userId, userId)
    })

    const mappedSurveys = surveys.map(async (survey) => {
      const responses = await getAllResultsBySurveyId(survey.id)

      return {
        ...survey,
        numberOfResponses: responses.length
      }
    })

    return await Promise.all(mappedSurveys)
  } catch (error) {
    console.log(error)
  }

  return []
}

export const createShareSurvey = async (surveyId: string, userId: string) => {
  try {
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
  } catch (error) {
    console.log(error)
  }

  return null
}
