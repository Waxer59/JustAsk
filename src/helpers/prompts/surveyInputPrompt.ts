import type { SurveyDocumentContent } from '@/types'

export const surveyInputPrompt = ({
  title,
  description,
  interviewStyle,
  additionalInfo,
  documentsContent
}: {
  title: string
  description: string
  interviewStyle: string
  additionalInfo?: string
  documentsContent?: Omit<SurveyDocumentContent, 'file'>[]
}): string => `
- Job Description:
  * Title: ${title}
  * Description: ${description}
- Interview Style: 
  * ${interviewStyle}

${
  additionalInfo
    ? `- Additional Information (You should take into account the following information): 
* Additional Information: ${additionalInfo}`
    : ''
}

${
  documentsContent
    ? documentsContent
        .map(
          ({ name, description, content }) => `
            - Document ${name}:
              * Description: ${description}
              * Content: ${content}
          `
        )
        .join('\n')
    : ''
}`
