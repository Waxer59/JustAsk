import type { LANGS } from '@/i18n/ui'

export interface OfferDetails {
  title: string
  description: string
}

export type SupportedLanguages = LANGS.en | LANGS.es

export interface CreateQuestionsResponse {
  questions: string[]
  secondsPerQuestion: number
  key: string
  timestamp: number
}

export interface SurveyResult {
  name: string
  email: string
  isAttempt: boolean
  category: string
  overallScore: number
  softSkillsScore: number
  hardSkillsScore: number
  log: {
    id: string
    question: string
    answer: string
  }[]
}

export interface AgentDetails {
  id: string
  name: string
  description: string
  action?: string
  isCustom: boolean
}

export interface UploadedDocument {
  name: string
}

export interface GetFeedbackRequest {
  offer: OfferDetails
  interviewQuestions: string[]
  interviewResponses: string[]
  language: string
}

export interface CreateQuestionsData {
  offer: OfferDetails
  interviewStyle: string
  language: string
  additionalInfo?: string
  documentsContent?: string[]
}

export interface DocumentContent {
  id: string
  content: string
  file: File
}

export interface SurveyDocumentContent {
  name: string
  description: string
  content: string
  file: File
}

export enum InterviewProcessSteps {
  OFFER,
  DOCUMENTS,
  SETUP,
  COMPLETE
}

export enum SurveySteps {
  USER,
  DOCUMENTS,
  INTERVIEW
}

export const numberOfInterviewSteps =
  Object.keys(InterviewProcessSteps).length / 2 // We divide by two because Object.keys() in a enum returns an array of key names and key indexes e.g. enum X { OFFER } will return [0, 'OFFER']

export const numberOfSurveySteps = Object.keys(SurveySteps).length / 2 // Refer to the comment above

export interface SurveyCategory {
  name: string
  description: string
}

export interface SurveyDocument {
  name: string
  description: string
  isOptional?: boolean
}

export interface SurveyDocumentContent extends SurveyDocument {
  content: string
}

export interface SurveyUser {
  name: string
  email: string
}

export interface Survey {
  id: string
  code: string
  title: string
  shareCode?: string | null
  description: string
  lang: SupportedLanguages
  offerStyle: string
  offerTitle: string
  offerDescription: string
  offerAdditionalInfo?: string | null
  numberOfSoftSkillsQuestions: number
  numberOfHardSkillsQuestions: number
  maxSubmissions: number
  maxAttempts: number
  customQuestions: string[]
  categories: SurveyCategory[]
  documents: SurveyDocument[]
  numberOfResponses: number
  numberOfAttemptQuestions: number
  secondsPerQuestion: number
}

export type UpdateSurvey = Partial<Survey>

export interface Document {
  id: string
  name: string
  description: string
  isCustom?: boolean
  isActive?: boolean
  isOptional?: boolean
}

export interface SurveySendResponse {
  feedback?: string
}

export interface OffersResponse {
  status: string
  request_id: string
  data: OfferResponseData[]
}

export interface OfferResponseData {
  employer_name: string
  employer_logo: null | string
  employer_website: null | string
  employer_company_type: null | string
  job_publisher: string
  job_id: string
  job_title: string
  job_apply_link: string
  job_apply_is_direct: boolean
  job_apply_quality_score: number
  job_description: string
  job_is_remote: boolean
  job_posted_at_timestamp: number
  job_posted_at_datetime_utc: Date
  job_city: string
  job_latitude: number
  job_longitude: number
  job_benefits: string[] | null
  job_google_link: string
  job_offer_expiration_datetime_utc: Date | null
  job_offer_expiration_timestamp: number | null
  job_required_skills: string[] | null
  job_experience_in_place_of_education: boolean
  job_min_salary: number | null
  job_max_salary: number | null
  job_salary_currency: null | string
  job_salary_period: null | string
  job_job_title: null | string
  job_onet_soc: string
  job_onet_job_zone: string
  job_naics_code?: string
  job_naics_name?: string
  job_occupational_categories?: string[]
}

export interface SurveysResponse {
  id: string
  title: string
  description: string
  lang: SupportedLanguages
  offerStyle: string
  offerTitle: string
  offerDescription: string
  offerAdditionalInfo?: string | null
  numberOfSoftSkillsQuestions: number
  numberOfHardSkillsQuestions: number
  customQuestions: string[]
  maxSubmissions: number
  maxAttempts: number
  code: string
  shareCode: null
  userId: string
  surveysToSurveyCategories: SurveysToSurveyCategory[]
  surveysToSurveysDocuments: SurveysToSurveysDocument[]
  numberOfResponses: number
  numberOfAttemptQuestions: number
  secondsPerQuestion: number
}

export interface SurveysToSurveyCategory {
  surveyId: string
  surveyCategoryId: string
  category: Category
}

export interface Category {
  id: string
  name: string
  description: string
  isActive?: boolean
}

export interface SurveysToSurveysDocument {
  surveyId: string
  surveyDocumentId: string
  document: Category
}
