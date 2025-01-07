import {
  pgEnum,
  pgTable,
  text,
  integer,
  uniqueIndex,
  boolean
} from 'drizzle-orm/pg-core'
import { user } from './auth-schema'
import {
  DEFAULT_ATTEMPTS,
  DEFAULT_HARD_SKILLS_QUESTIONS,
  DEFAULT_MAX_SUBMISSIONS,
  DEFAULT_SOFT_SKILLS_QUESTIONS,
  INTERVIEW_LANGUAGES
} from '@/constants'
import { createId } from '@paralleldrive/cuid2'

export const langEnum = pgEnum('lang', INTERVIEW_LANGUAGES)

export const survey = pgTable(
  'survey',
  {
    id: text('id').primaryKey().$defaultFn(crypto.randomUUID),
    title: text('title').notNull(),
    description: text('description'),
    lang: langEnum().notNull(),
    offerStyle: text('offer_style').notNull(),
    offerTitle: text('offer_title').notNull(),
    offerDescription: text('offer_description').notNull(),
    offerAdditionalInfo: text('offer_additional_info'),
    numberOfSoftSkillsQuestions: integer(
      'number_of_soft_skills_questions'
    ).default(DEFAULT_SOFT_SKILLS_QUESTIONS),
    numberOfHardSkillsQuestions: integer(
      'number_of_hard_skills_questions'
    ).default(DEFAULT_HARD_SKILLS_QUESTIONS),
    customQuestions: text('custom_questions').array().default([]),
    maxSubmissions: integer('max_submissions').default(DEFAULT_MAX_SUBMISSIONS),
    maxAttempts: integer('max_attempts').default(DEFAULT_ATTEMPTS),
    code: text('code').$defaultFn(createId),
    shareCode: text('share_code'),
    userId: text('user_id').references(() => user.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },
  (table) => ({
    code: uniqueIndex('code_idx').on(table.code),
    shareCode: uniqueIndex('share_code_idx').on(table.shareCode)
  })
)

export const surveysToSurveyCategories = pgTable(
  'surveys_to_survey_categories',
  {
    surveyId: text('survey_id').references(() => survey.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }),
    surveyCategoryId: text('survey_category_id').references(
      () => surveyCategory.id,
      {
        onDelete: 'cascade',
        onUpdate: 'cascade'
      }
    )
  }
)

export const surveyCategory = pgTable('survey_category', {
  id: text('id').primaryKey().$defaultFn(crypto.randomUUID),
  name: text('name').notNull(),
  description: text('description'),
  isActive: boolean('is_active').notNull().default(true)
})

export const surveysToSurveysDocuments = pgTable(
  'surveys_to_surveys_documents',
  {
    surveyId: text('survey_id').references(() => survey.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }),
    surveyDocumentId: text('survey_document_id').references(
      () => surveyDocument.id,
      {
        onDelete: 'cascade',
        onUpdate: 'cascade'
      }
    )
  }
)

export const surveyDocument = pgTable('survey_document', {
  id: text('id').primaryKey().$defaultFn(crypto.randomUUID),
  name: text('name').notNull(),
  description: text('description')
})
