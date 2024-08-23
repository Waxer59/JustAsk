import type { OfferDetails } from '@/types'

export const createFeedbackPrompt = ({
  offer,
  interviewQuestions,
  interviewResponses
}: {
  offer: OfferDetails
  interviewQuestions: string[]
  interviewResponses: string[]
}) => `Job Offer Details:
      - Title: ${offer.title}
      - Description: ${offer.description}
      
      Interview Questions:
      ${interviewQuestions
        .map(
          (question, idx) => `
        - Question: ${question}
        - Answer: ${interviewResponses[idx]}
        `
        )
        .join('\n')}`
