export enum ALLOWED_JOB_OFFERS_SITES {
  INFOJOBS = 'infojobs.net',
  INDEED = 'indeed.com',
  LINKEDIN = 'linkedin.com',
  TECNOEMPLEO = 'tecnoempleo.com'
}

export const ALLOWED_JOB_OFFERS_SITES_ARRAY = Object.values(
  ALLOWED_JOB_OFFERS_SITES
) as string[]

export const NUMBER_OF_INTERVIEW_QUESTIONS = 10

export const CONFETTI_DURATION = 2.5 * 1000 // ms
export const CONFETTI_DEFAULTS = {
  startVelocity: 30,
  spread: 360,
  ticks: 60,
  zIndex: 0
}
