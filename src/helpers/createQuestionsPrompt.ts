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
- Additional Information (if any):
${additionalInfo ? `* Additional Information: ${additionalInfo}` : ''}
- Documents Provided (if any):
${filesContent ? filesContent.map((text, idx) => `Document ${idx}: ${text}`).join('\n') : ''}`
