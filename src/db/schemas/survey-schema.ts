import { pgEnum, pgTable, text, integer } from 'drizzle-orm/pg-core'
import { user } from './auth-schema'

export const langEnum = pgEnum('lang', ['en', 'es'])

export const survey = pgTable('survey', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  lang: langEnum(),
  offerStyle: text('offer_style').notNull(),
  offerTitle: text('offer_title').notNull(),
  offerDescription: text('offer_description').notNull(),
  offerAdditionalInfo: text('offer_additional_info'),
  numberOfSoftSkillsQuestions: integer(
    'number_of_soft_skills_questions'
  ).default(3),
  numberOfHardSkillsQuestions: integer(
    'number_of_hard_skills_questions'
  ).default(3),
  customQuestions: text('custom_questions').array().default([]),
  code: text('code').notNull(),
  shareCode: text('share_code'),
  userId: text('user_id').references(() => user.id)
})

export const surveysToSurveyCategories = pgTable(
  'surveys_to_survey_categories',
  {
    surveyId: text('survey_id').references(() => survey.id),
    surveyCategoryId: text('survey_category_id').references(
      () => surveyCategory.id
    )
  }
)

export const surveyCategory = pgTable('survey_category', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description')
})

export const surveysToSurveysDocuments = pgTable(
  'surveys_to_surveys_documents',
  {
    surveyId: text('survey_id').references(() => survey.id),
    surveyDocumentId: text('survey_document_id').references(
      () => surveyDocument.id
    )
  }
)

export const surveyDocument = pgTable('survey_document', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description')
})
