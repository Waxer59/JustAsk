export const evaluateSurveyPrompt = ({
  jobTitle,
  jobDescription,
  jobAditionalInfo,
  JobStyle,
  questions,
  lang
}: {
  jobTitle: string
  jobDescription: string
  jobAditionalInfo: string
  JobStyle: string
  questions: Array<{ question: string; answer: string }>
  lang: string
}): string => `
As an expert evaluator for job interviews, your task is to assess and correct a job interview based on the following parameters:

Evaluation Parameters:
1. softSkillsScore: Provide a score from 0 to 10, where 0 is the lowest and 10 is the highest. Evaluate the candidate's communication skills, interpersonal skills, teamwork, and adaptability.
2. hardSkillsScore: Provide a score from 0 to 10, where 0 is the lowest and 10 is the highest. Evaluate the candidate's technical knowledge, problem-solving ability and proficiency in required tools and technologies.
3. overallScore: Provide a score from 0 to 10, where 0 is the lowest and 10 is the highest. This score should represent the candidate's overall performance, considering both soft and hard skills, as well as their fit for the role.
4. category: (Optional) Specify the professional category or profile of the candidate (e.g., software engineer, marketing manager, data scientist).
5. feedback: Provide a qualitative comment offering constructive feedback for the candidate. Discuss their strengths and areas for improvement, along with specific examples from their interview responses.

Evaluation Criteria:
1. softSkillsScore:
    - High (8-10): Candidate exhibits exceptional communication, interpersonal skills, teamwork, and adaptability.
    - Medium (4-7): Candidate shows competence but has room for improvement in soft skills.
    - Low (0-3): Candidate demonstrates significant deficiencies in soft skills.
2. hardSkillsScore:
    - High (8-10): Candidate demonstrates strong technical knowledge, problem-solving skills, and proficiency in required tools and technologies.
    - Medium (4-7): Candidate meets the basic technical requirements but needs improvement.
    - Low (0-3): Candidate lacks necessary technical skills.
3. overallScore:
    - High (8-10): Candidate is an exceptional fit for the role, meeting or exceeding all requirements.
    - Medium (5-7): Candidate is competent but has areas for improvement.
    - Low (0-4): Candidate does not meet the essential criteria for the role.

Provided Input:
1. Job Offer: This includes the job description, requirements, and desired competencies. Additional relevant information may also be provided if available.
2. Questions and Answers: A list of the questions asked during the interview along with the candidate's responses.

Instructions:
- Please review the given information and provide your assessment based on the evaluation parameters. Include scores for soft skills, hard skills, and overall performance. Additionally, provide qualitative feedback for the candidate.
- Carefully review the provided job description, interview questions, and candidate's responses. Then, evaluate the candidate based on the parameters specified. Offer a detailed and demanding assessment to ensure a comprehensive evaluation of the candidate's capabilities and fit for the job.

YOU MUST RESPOND IN THE LANGUAGE: ${lang}

---

User Input:

Job Description:
* Title: ${jobTitle}
* Description: ${jobDescription}

Interview Style:
* ${JobStyle}

${
  jobAditionalInfo
    ? `Additional Information (You should take into account the following information):
* Additional Information: ${jobAditionalInfo}`
    : ''
}

Questions and Answers:
${questions
  .map(
    ({ question, answer }) => `
* Question: ${question}
* Answer: ${answer}
`
  )
  .join('\n')}
`
