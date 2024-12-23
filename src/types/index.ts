export interface OfferDetails {
  title: string
  description: string
}

export type SuportLanguages = 'en' | 'es'

export interface CreateQuestionsResponse {
  questions: string[]
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
}

export interface CreateSurveyUser {
  name: string
  email: string
  surveyId: string
}

export interface Survey {
  id: string
  title: string
  description: string
  lang: SuportLanguages
  offerStyle: string
  offerTitle: string
  offerDescription: string
  offerAdditionalInfo: string
  numberOfSoftSkillsQuestions: number
  numberOfHardSkillsQuestions: number
  customQuestions: string[]
  categories: SurveyCategory[]
  documents: SurveyDocument[]
}

export type UpdateSurvey = Partial<Survey>

export interface Document {
  id: string
  name: string
  description: string
  isCustom?: boolean
  isChecked?: boolean
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
