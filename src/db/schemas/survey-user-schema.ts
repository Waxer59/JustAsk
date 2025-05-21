import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { survey } from './survey-schema'
import { relations } from 'drizzle-orm'

export const surveyUser = pgTable('survey_user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  policyAcceptedAt: timestamp('policy_accepted_at'),
  policyVersion: text('policy_version')
})

export const surveyUsersToSurveys = pgTable('survey_users_to_surveys', {
  surveyId: text('survey_id').references(() => survey.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
  }),
  surveyUserId: text('survey_user_id').references(() => surveyUser.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
  })
})

export const surveyUsersToSurveysRelations = relations(
  surveyUsersToSurveys,
  ({ one }) => ({
    survey: one(survey, {
      fields: [surveyUsersToSurveys.surveyId],
      references: [survey.id]
    }),
    surveyUser: one(surveyUser, {
      fields: [surveyUsersToSurveys.surveyUserId],
      references: [surveyUser.id]
    })
  })
)

export const surveyUserRelations = relations(surveyUser, ({ many }) => ({
  surveyUsersToSurveys: many(surveyUsersToSurveys)
}))
