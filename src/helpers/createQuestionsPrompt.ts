export const createQuestionsPrompt = ({
  title,
  description,
  interviewStyle,
  additionalInfo,
  filesContent
}: {
  title: string
  description: string
  interviewStyle: string
  additionalInfo?: string
  filesContent?: string[]
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
  filesContent
    ? filesContent
        .map(
          (
            text,
            idx
          ) => `- Documents Provided (You should be aware of and ask questions about these documents):
Document ${idx}: ${text}`
        )
        .join('\n')
    : ''
}`
