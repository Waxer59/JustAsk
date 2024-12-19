import { pgTable, text } from 'drizzle-orm/pg-core'
import { survey } from './survey-schema'

export const surveyUser = pgTable('survey_user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull()
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
