import {
  pgTable,
  text,
  timestamp,
  json,
  boolean,
  integer
} from 'drizzle-orm/pg-core'
import { survey } from './survey-schema'
import { surveyUser } from './survey-user-schema'
import { relations } from 'drizzle-orm'

export const surveyResult = pgTable('survey_result', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  surveyId: text('survey_id').references(() => survey.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
  }),
  overallScore: integer('overall_score'),
  scoreSoftSkills: integer('score_soft_skills'),
  scoreHardSkills: integer('score_hard_skills'),
  category: text('category'),
  surveyLog: json('survey_log'),
  isAttempt: boolean('is_attempt').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

export const surveyResultToSurveyUser = pgTable(
  'survey_result_to_survey_user',
  {
    surveyResultId: text('survey_result_id').references(() => surveyResult.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }),
    surveyUserId: text('survey_user_id').references(() => surveyUser.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  }
)

export const surveyResultToSurveyUserRelations = relations(
  surveyResultToSurveyUser,
  ({ one }) => ({
    surveyResult: one(surveyResult, {
      fields: [surveyResultToSurveyUser.surveyResultId],
      references: [surveyResult.id]
    }),
    surveyUser: one(surveyUser, {
      fields: [surveyResultToSurveyUser.surveyUserId],
      references: [surveyUser.id]
    })
  })
)

export const surveyResultRelations = relations(surveyResult, ({ many }) => ({
  surveyResultToSurveyUser: many(surveyResultToSurveyUser)
}))
