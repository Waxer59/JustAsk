export interface OfferDetails {
  title: string
  description: string
}

export interface ScrapeFields {
  title: string
  desc: string
}

export enum InterviewProcessSteps {
  OFFER = 'Oferta',
  DOCUMENTS = 'Documentos',
  SETUP = 'Configura',
  COMPLETE = '¡Listo!'
}

export const InterviewProcessStepsTexts = Object.values(InterviewProcessSteps)

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
