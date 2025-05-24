export const evaluateSurveyPrompt = ({
  jobTitle,
  jobDescription,
  jobAditionalInfo,
  JobStyle,
  questions,
  lang,
  categories
}: {
  jobTitle: string
  jobDescription: string
  jobAditionalInfo: string
  JobStyle: string
  questions: Array<{ question: string; answer: string }>
  lang: string
  categories: Array<{ name: string; description: string }>
}): string => `
As an expert evaluator for job interviews, your task is to assess and provide scores for a candidate's job interview performance, along with constructive feedback, based on the following parameters:

### Evaluation Parameters:
1. **SoftSkillsScore:** Provide a score from 0 to 10, where 0 is the lowest and 10 is the highest. Evaluate the candidate's communication skills, interpersonal skills, teamwork, and adaptability.
2. **HardSkillsScore:** Provide a score from 0 to 10, where 0 is the lowest and 10 is the highest. Evaluate the candidate's technical knowledge, problem-solving ability, and proficiency in required tools and technologies.
3. **OverallScore:** Provide a score from 0 to 10, where 0 is the lowest and 10 is the highest. This score should represent the candidate's overall performance, considering both soft and hard skills, as well as their fit for the role.
4. **Category:** (Optional) Specify the professional category or profile of the candidate.
5. **Feedback:** Provide positive feedback to help the candidate improve. Use a tone that strengthens the candidate's morale and is friendly but professional. Include detailed feedback on areas where the candidate can improve and mention the aspects they performed well.

### Provided Input:
1. **Job Offer:** This includes the job description, requirements, and desired competencies. Additional relevant information may also be provided if available.
2. **Questions and Answers:** A list of the questions asked during the interview along with the candidate's responses.

### Instructions:
1. Review the given job description, interview questions, and candidate's responses thoroughly.
2. Assign scores for soft skills, hard skills, and overall performance based on the evaluation parameters.
3. Ensure the scores accurately reflect the candidate's performance (between 0 and 10, 0 being the lowest and 10 being the highest).
4. Provide qualitative feedback that is constructive and encouraging. Highlight the candidate's strengths and areas for improvement with specific examples.
5. Maintain a friendly but professional tone in your feedback to enhance the candidate's morale.
6. You MUST provide feedback in the language: ${lang}
7. You MUST use the following format for your feedback, do not give any other format:
8. You MUST provide feedback you CANT leave it empty. The feedback has to be positive reinforcement for the candidate pointing out areas of improvement and areas where the candidate has done well, address the candidate directly by talking to the candidate but do not include the name of the candidate, as if you were an interviewer giving feedback to the candidate, use a friendly tone.

---

### User Input:
- **Job Title:** ${jobTitle}
- **Description:** ${jobDescription}
- **Interview Style:** ${JobStyle}

${jobAditionalInfo ? `Additional Information: ${jobAditionalInfo}` : ''}

${categories.length > 0 ? `You MUST categorize the user based on the following categories: ${categories.map(({ name, description }) => `${name}: ${description}`).join(', ')}` : ''}

### Questions and Answers:
${questions.map(({ question, answer }) => `Question: ${question} Answer: ${answer}`).join('\n')}
`
