import { useInterviewStore } from '@/store/interview'
import { Questions } from './QuestionsFinal'
import { InterviewChatFinal } from './InterviewChatFinal'
import { NUMBER_OF_INTERVIEW_QUESTIONS } from '@constants'

export const FinalStep = () => {
  const isSimulatingInterview = useInterviewStore(
    (state) => state.isSimulatingInterview
  )
  const questions = useInterviewStore((state) => state.questions)

  return (
    <>
      {!isSimulatingInterview && questions && (
        <Questions
          questions={questions.slice(0, NUMBER_OF_INTERVIEW_QUESTIONS)}
        />
      )}
      {isSimulatingInterview && questions && (
        <InterviewChatFinal questions={questions} />
      )}
    </>
  )
}
