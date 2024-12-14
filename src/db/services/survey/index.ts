import { db } from '@/db'
import {
  survey,
  surveyCategory,
  surveyDocument,
  surveysToSurveyCategories,
  surveysToSurveysDocuments
} from '@/db/schemas/survey-schema'
import { createSurveySchema } from '@/lib/validationSchemas/create-survey'
import type { CreateSurvey } from '@/types'

type NewSurvey = typeof survey.$inferInsert
type NewCategory = typeof surveyCategory.$inferInsert
type NewDocument = typeof surveyDocument.$inferInsert

export const createSurvey = async (
  userId: string,
  createSurvey: CreateSurvey
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
            code: crypto.randomUUID(),
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

// export const updateSurvey = async (
//   surveyId: string,
//   updateSurvey: UpdateSurvey
// ) => {
//   throw new Error('Not implemented')
// }

// export const deleteSurvey = async (surveyId: string) => {
//   throw new Error('Not implemented')
// }

// export const getAllUserSurveys = async (userId: string) => {
//   throw new Error('Not implemented')
// }
