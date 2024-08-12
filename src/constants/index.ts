export enum ALLOWED_JOB_OFFERS_SITES {
  INFOJOBS = 'infojobs.net',
  INDEED = 'indeed.com',
  LINKEDIN = 'linkedin.com',
  TECNOEMPLEO = 'tecnoempleo.com'
}

export const ALLOWED_JOB_OFFERS_SITES_ARRAY = Object.values(
  ALLOWED_JOB_OFFERS_SITES
) as string[]
