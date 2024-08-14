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
}): string =>
  `The job title is ${title}, the job description is ${description}, the required interview style is ${interviewStyle} ${additionalInfo ? `,and the additional information provided by the candidate is ${additionalInfo}.` : '.'} ${filesContent ? filesContent.map((text, idx) => `File ${idx}: ${text}`) : ''}`
