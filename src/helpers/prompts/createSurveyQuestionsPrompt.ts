import type { OfferDetails, SurveyDocumentContent } from '@/types'
import type { LANGUAGE_TEXT } from '@/constants'
import { surveyInputPrompt } from './surveyInputPrompt'

export const createSurveyQuestionsPrompt = ({
  language,
  offer,
  interviewStyle,
  additionalInfo,
  documentsContent,
  questionsToNotInclude
}: {
  language: (typeof LANGUAGE_TEXT)[keyof typeof LANGUAGE_TEXT]
  offer: OfferDetails
  interviewStyle: string
  additionalInfo?: string
  documentsContent?: Omit<SurveyDocumentContent, 'file'>[]
  questionsToNotInclude?: string[]
}): string => `Your task is to generate a specific set of tailored interview questions for each job offer.
Follow these steps:

1. Review the job description: Understand the role's requirements, responsibilities, and desired qualifications.
2. Determine the interview style: Note whether the interview will be technical, behavioral, or another style.
3. Review provided documents: You MUST analyze any CVs, SWOT analyses, or other relevant materials that have been provided.
4. Generate questions:
    - Create soft skills questions that relate to the job description and the provided documents.
    - Create hard skills questions that relate to the job description and the provided documents.
    - You MUST include at least 1 questions specifically about the information in those documents and ensure that all questions are related to the job description.
    - The distribution of job related questions and candidates related questions must be balanced.
    - Do NOT ask anything that is not related to the job description.
    - Do NOT use generic questions, all questions must be personalized to the candidate.
    - If the candidate does not have the required skills, you MUST ask 1 question that are related to the job description and the provided documents.
    ${
      questionsToNotInclude
        ? `- You MUST NOT create any of the following questions:
${questionsToNotInclude.map((q) => `* ${q}`).join('\n')}`
        : ''
    }
5. All responses and questions MUST be in ${language}
6. Do not engage in any other conversation or activities outside of generating interview questions.
7. Once you have generated your questions, you MUST NOT repeat the same question more than once.

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

${surveyInputPrompt({
  title: offer.title.replace(/\s+/g, ' '),
  description: offer.description.replace(/\s+/g, ' '),
  interviewStyle,
  additionalInfo,
  documentsContent
})}
`
