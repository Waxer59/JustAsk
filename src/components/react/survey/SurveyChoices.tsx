import { useEffect, useState } from 'react'
import { useSurveyStore } from '@/store/survey'
import { useQuery } from '@tanstack/react-query'
import type { CreateQuestionsResponse, SurveySendResponse } from '@/types'
import { Loading } from '../common/Loading'
import { getUiTranslations } from '@/i18n/utils'
import { ErrorMessage } from '../common/ErrorMessage'
import { InterviewChat } from '../common/InterviewChat'
import { useUiStore } from '@/store/ui'
import { SurveyCompleted } from './SurveyCompleted'
import { SurveyChoicesButtons } from './SurveyChoicesButtons'

const { t } = getUiTranslations()

export const SurveyChoices = () => {
  const [numberOfAttempts, setNumberOfAttempts] = useState<number>(0)
  const [numberOfSubmissions, setNumberOfSubmissions] = useState<number>(0)
  const [hasChosen, setHasChosen] = useState<boolean>(false)
  const [hasInterviewFinished, setHasInterviewFinished] =
    useState<boolean>(false)
  const [sendSurveyData, setSendSurveyData] = useState({})

  const email = useSurveyStore((state) => state.email)
  const name = useSurveyStore((state) => state.name)
  const code = useSurveyStore((state) => state.currentSurveyId)
  const files = useSurveyStore((state) => state.files)
  const lang = useSurveyStore((state) => state.lang)
  const isAttempt = useSurveyStore((state) => state.isAttempt)
  const setIsAttempt = useSurveyStore((state) => state.setIsAttempt)
  const setHideControlButtons = useUiStore(
    (state) => state.setHideControlButtons
  )

  const {
    isLoading: areQuestionsLoading,
    refetch: refetchQuestions,
    data: questionsData,
    isError: isQuestionsError
  } = useQuery<CreateQuestionsResponse>({
    queryKey: ['questions', isAttempt],
    enabled: false,
    retry: false,
    queryFn: async () => {
      return fetch(`/api/survey/${code}/createQuestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          documents: files.map(({ name, description, content }) => ({
            name,
            description,
            content
          })),
          user: {
            name: name,
            email: email
          },
          isAttempt
        })
      }).then((res) => res.json())
    }
  })
  const {
    isLoading: isSurveySending,
    refetch: refetchSurveySend,
    data: surveySendData
  } = useQuery<SurveySendResponse>({
    queryKey: ['survey', sendSurveyData],
    enabled: false,
    retry: false,
    queryFn: async () => {
      return fetch(`/api/survey/${code}/submitQuestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendSurveyData)
      }).then((res) => res.json())
    }
  })

  const setNumberOfAttemptsAndSubmissions = async () => {
    try {
      const response = await fetch(`/api/survey/${code}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email
        })
      })
      const data = await response.json()

      setNumberOfAttempts(data.attempts)
      setNumberOfSubmissions(data.submissions)
    } catch (error) {
      console.error(error)
    }
  }

  const handleChoiceClick = () => {
    setHasChosen(true)
    setHideControlButtons(true)
    setHasInterviewFinished(false)
  }

  const handleAttemptClick = () => {
    handleChoiceClick()
    setIsAttempt(true)
    setNumberOfAttempts(numberOfAttempts - 1)
  }

  const handleSubmissionClick = () => {
    handleChoiceClick()
    setIsAttempt(false)
    setNumberOfSubmissions(numberOfSubmissions - 1)
  }

  useEffect(() => {
    setNumberOfAttemptsAndSubmissions()
  }, [])

  useEffect(() => {
    if (hasChosen) {
      refetchQuestions()
    }
  }, [isAttempt, hasChosen])

  const handleSumbitSurvey = (responses: string[]) => {
    setHasInterviewFinished(true)
    setSendSurveyData({
      questions: questionsData!.questions.map((question, idx) => ({
        question: question,
        answer: responses[idx]
      })),
      user: {
        name,
        email
      },
      isAttempt,
      key: questionsData!.key,
      timestamp: questionsData!.timestamp
    })
  }

  useEffect(() => {
    if (hasInterviewFinished) {
      refetchSurveySend()
    }
  }, [hasInterviewFinished])

  if (!hasChosen) {
    return (
      <div>
        <h2 className="text-4xl text-center font-semibold italic">
          {t('survey.choices', lang)}
        </h2>
        <SurveyChoicesButtons
          numberOfAttempts={numberOfAttempts}
          numberOfSubmissions={numberOfSubmissions}
          onAttemptClick={handleAttemptClick}
          onSubmissionClick={handleSubmissionClick}
        />
      </div>
    )
  }

  return (
    <>
      {areQuestionsLoading && <Loading text={t('questions.loading')} />}
      {isSurveySending && <Loading text={'Enviando la encuesta'} />}
      {isQuestionsError && (
        <ErrorMessage text={t('questions.error')} lang={lang} />
      )}
      {questionsData && !hasInterviewFinished && (
        <InterviewChat
          secondsToAnswer={questionsData.secondsPerQuestion}
          onSubmit={handleSumbitSurvey}
          questions={questionsData.questions}
          lang={lang}
        />
      )}
      {hasInterviewFinished && !isSurveySending && (
        <div className="flex flex-col items-center justify-center gap-4">
          <SurveyCompleted
            feedback={surveySendData?.feedback}
            showFeedback={!isAttempt}
          />
          {isAttempt && (
            <SurveyChoicesButtons
              numberOfAttempts={numberOfAttempts}
              numberOfSubmissions={numberOfSubmissions}
              onAttemptClick={handleAttemptClick}
              onSubmissionClick={handleSubmissionClick}
            />
          )}
        </div>
      )}
    </>
  )
}
