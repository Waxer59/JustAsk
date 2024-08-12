export interface OfferDetails {
  title: string
  desc: string
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
