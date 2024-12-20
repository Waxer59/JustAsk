import type { OfferDetails } from '@/types'
import { userInputQuestionsPrompt } from './UserInputQuestionsPrompt'

export const createQuestionsPrompt = ({
  language,
  offer,
  interviewStyle,
  additionalInfo,
  documentsContent
}: {
  language: string
  offer: OfferDetails
  interviewStyle: string
  additionalInfo?: string
  documentsContent?: string[]
}): string => `Your task is to generate a specific set of tailored interview questions for each job offer.
        Follow these steps:
        
        1. Review the job description: Understand the role's requirements, responsibilities, and desired qualifications.
        2. Determine the interview style: Note whether the interview will be technical, behavioral, or another style.
        3. Review provided documents: You MUST analyze any CVs, SWOT analyses, or other relevant materials that have been provided.
        4. Generate questions:
            - Create questions that relate to the job description and the provided documents.
            - Ensure at least 3 questions specifically pertain to the provided documents if any are supplied.
            - Include a mix of technical, behavioral, and general questions.
            - Adapt and refine your questions based on any new information provided by the candidate during the interview
        5. Language considerations:
           * All responses and questions must be in ${language}
        6. Do not engage in any other conversation or activities outside of generating interview questions.

        IMPORTANT: If the user has provided any documents, you MUST CREATE at least 3 QUESTIONS specifically about the information in those documents.

        Example Structure:

        - Job Description:
          * Title: ... insert title here ...
          * Description: ... insert description here ...
        - Interview Style: 
          * ... insert interview style here ...
        - Additional Information (if any):
           ... insert additional info here ...
        - Documents Provided (if any):
           ... insert documents content here ...
    
        Use this structure and guidelines to generate tailored interview questions in the correct language.
        
        ---

        User Input:
        
        ${userInputQuestionsPrompt({
          title: offer.title.replace(/\s+/g, ' '),
          description: offer.description.replace(/\s+/g, ' '),
          interviewStyle,
          additionalInfo,
          documentsContent
        })}
        `
