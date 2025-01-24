import {
  pgTable,
  text,
  decimal,
  timestamp,
  json,
  boolean
} from 'drizzle-orm/pg-core'
import { survey } from './survey-schema'

export const surveyResult = pgTable('survey_result', {
  id: text('id').primaryKey(),
  surveyId: text('survey_id').references(() => survey.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
  }),
  overallScore: decimal('overall_score'),
  scoreSoftSkills: decimal('score_soft_skills'),
  scoreHardSkills: decimal('score_hard_skills'),
  category: text('category'),
  surveyLog: json('survey_log'),
  isAttempt: boolean('is_attempt').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull()
})
