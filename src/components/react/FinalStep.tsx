import { useInterviewStore } from '@/store/interview'
import { Questions } from './QuestionsFinal'
import { InterviewChatFinal } from './InterviewChatFinal'

export const FinalStep = () => {
  const isSimulatingInterview = useInterviewStore(
    (state) => state.isSimulatingInterview
  )
  const questions = useInterviewStore((state) => state.questions)

  return (
    <>
      {!isSimulatingInterview && questions && (
        <Questions questions={questions} />
      )}
      {isSimulatingInterview && questions && (
        <InterviewChatFinal questions={questions} />
      )}
    </>
  )
}
