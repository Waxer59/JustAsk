import { useInterviewStore } from '@/store/interview'
import { Questions } from './QuestionsFinal'
import { InterviewChatFinal } from './InterviewChatFinal'
import { LANG_CODES, NUMBER_OF_INTERVIEW_QUESTIONS } from '@constants'
import { Loading } from './Loading'
import { InterviewFeedbackFinal } from './InterviewFeedbackFinal'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { ErrorMessage } from './ErrorMessage'
import { getLangFromUrl, useTranslations } from '@/i18n/utils'

const url = new URL(window.location.href)
const lang = getLangFromUrl(url)
const t = useTranslations(lang)

export const FinalStep = () => {
  const isSimulatingInterview = useInterviewStore(
    (state) => state.isSimulatingInterview
  )
  const currentOffer = useInterviewStore((state) => state.currentOffer)
  const answers = useInterviewStore((state) => state.answers)
  const questions = useInterviewStore((state) => state.questions)
  const hasInterviewFinished = useInterviewStore(
    (state) => state.hasInterviewFinished
  )
  const interviewQuestions = questions?.slice(0, NUMBER_OF_INTERVIEW_QUESTIONS)
  const {
    refetch,
    data: feedbackData,
    isError: isFeedbackError,
    isLoading: isFeedbackLoading
  } = useQuery({
    enabled: false,
    retry: false,
    queryKey: ['interview', interviewQuestions],
    queryFn: () =>
      fetch('/api/getInterviewFeedback', {
        method: 'POST',
        body: JSON.stringify({
          offer: currentOffer,
          interviewQuestions,
          interviewResponses: answers,
          language: lang
        })
      }).then((res) => res.json())
  })

  useEffect(() => {
    if (hasInterviewFinished) {
      refetch()
    }
  }, [hasInterviewFinished])

  return (
    <>
      {!isSimulatingInterview && <Questions questions={questions} />}
      {isSimulatingInterview && !hasInterviewFinished && (
        <InterviewChatFinal
          questions={interviewQuestions}
          langRecognition={LANG_CODES[lang]}
        />
      )}

      {/* Feedback */}
      {feedbackData && (
        <InterviewFeedbackFinal
          feedback={feedbackData.evaluation.feedback}
          score={+feedbackData.evaluation.score}
        />
      )}
      {isFeedbackLoading && <Loading text={t('feedback.loading')} />}
      {isFeedbackError && <ErrorMessage text={t('feedback.error')} />}
    </>
  )
}
