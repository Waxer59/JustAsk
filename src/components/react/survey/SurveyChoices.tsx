import { Button } from '@/ui/button'
import { HorizontalLine } from '../common/HorizontalLine'
import { useEffect, useState } from 'react'
import { useSurveyStore } from '@/store/survey'
import { useQuery } from '@tanstack/react-query'
import type { CreateQuestionsResponse } from '@/types'
import { Loading } from '../common/Loading'
import { getUiTranslations } from '@/i18n/utils'
import { ErrorMessage } from '../common/ErrorMessage'
import { InterviewChat } from '../common/InterviewChat'
import { LANG_CODES } from '@/constants'
import { useUiStore } from '@/store/ui'

const { t } = getUiTranslations()

export const SurveyChoices = () => {
  const [numberOfAttempts, setNumberOfAttempts] = useState<number>(0)
  const [numberOfSubmissions, setNumberOfSubmissions] = useState<number>(0)
  const [hasChosen, setHasChosen] = useState<boolean>(false)

  const email = useSurveyStore((state) => state.email)
  const name = useSurveyStore((state) => state.name)
  const code = useSurveyStore((state) => state.currentSurveyId)
  const files = useSurveyStore((state) => state.files)
  const lang = useSurveyStore((state) => state.lang)
  const setIsAttempt = useSurveyStore((state) => state.setIsAttempt)
  const setHideControlButtons = useUiStore(
    (state) => state.setHideControlButtons
  )

  const { isLoading, refetch, data, isError } =
    useQuery<CreateQuestionsResponse>({
      queryKey: ['questions'],
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
            }))
          })
        }).then((res) => res.json())
      }
    })

  useEffect(() => {
    const init = async () => {
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

    init()
  }, [])

  const handleAttemptClick = () => {
    setHasChosen(true)
    setIsAttempt(true)
    setHideControlButtons(true)
    refetch()
  }

  const handleSubmitClick = () => {
    setHasChosen(true)
    setIsAttempt(false)
    setHideControlButtons(true)
    refetch()
  }

  if (!hasChosen) {
    return (
      <div>
        <h2 className="text-4xl text-center font-semibold italic">
          Elige una opción
        </h2>
        <div className="mt-12 flex flex-col gap-4 w-full">
          <Button variant="secondary" onClick={handleAttemptClick}>
            Entrenar ({numberOfAttempts} intentos)
          </Button>
          <HorizontalLine text="o" />
          <Button onClick={handleSubmitClick}>
            Enviar como intento ({numberOfSubmissions} intento)
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {isLoading && <Loading text={t('questions.loading')} />}
      {isError && <ErrorMessage text={t('questions.error')} />}
      {data && (
        <InterviewChat
          questions={data.questions}
          langRecognition={LANG_CODES[lang]}
        />
      )}
    </>
  )
}
