import { useSurveyStore } from '@/store/survey'
import { Stepper } from '../common/Stepper'
import { SurveyChoices } from './SurveyChoices'
import { SurveyDocuments } from './SurveyDocuments'
import { SurveyUserDataForm } from './SurveyUserDataForm'
import { SurveyWelcomeMessage } from './SurveyWelcomeMessage'
import { useEffect, useMemo } from 'react'
import { ControlButtons } from '../common/ControlButtons'
import { SurveySteps } from '@/types'
import { surveyUserDataSchema } from '@/lib/validationSchemas/survey-user-data'

const HIDE_CONTROL_BUTTONS_STEPS = [SurveySteps.USER]

const DOCUMENTS_STEP = 'Documentos'
const STEPS = ['Usuario', 'Comenzar']

export interface RequiredDocument {
  id: string
  name: string
  description: string
}

interface Props {
  surveyId: string
  requiredDocuments?: RequiredDocument[]
}

export const Survey: React.FC<Props> = ({
  surveyId,
  requiredDocuments = []
}) => {
  const setCurrentSurveyId = useSurveyStore((state) => state.setCurrentSurveyId)
  const currentStep = useSurveyStore((state) => state.currentStep)
  const files = useSurveyStore((state) => state.files)
  const name = useSurveyStore((state) => state.name)
  const email = useSurveyStore((state) => state.email)
  const nextStep = useSurveyStore((state) => state.nextStep)
  const prevStep = useSurveyStore((state) => state.prevStep)
  const setName = useSurveyStore((state) => state.setName)
  const setEmail = useSurveyStore((state) => state.setEmail)
  const setCurrentStep = useSurveyStore((state) => state.setCurrentStep)

  const haveRequiredDocuments = files.length >= requiredDocuments.length
  const shouldDisableNextButton =
    currentStep === SurveySteps.DOCUMENTS && !haveRequiredDocuments

  const steps = useMemo(() => {
    const newSteps = [...STEPS]

    if (requiredDocuments.length > 0) {
      newSteps.splice(1, 0, DOCUMENTS_STEP)
    }

    return newSteps
  }, [requiredDocuments])

  useEffect(() => {
    setCurrentSurveyId(surveyId)
  }, [surveyId])

  useEffect(() => {
    const { error } = surveyUserDataSchema.safeParse({
      name,
      email
    })

    if (error) {
      setName('')
      setEmail('')
    } else {
      const nextStep =
        requiredDocuments.length > 0
          ? SurveySteps.DOCUMENTS
          : SurveySteps.INTERVIEW
      setCurrentStep(nextStep)
    }
  }, [])

  return (
    <>
      <header className="mt-28 flex flex-col gap-10">
        <Stepper steps={steps} currentStep={0} />
      </header>
      <main className="max-w-3xl mx-auto w-full mt-28 flex flex-col gap-10">
        {currentStep === SurveySteps.USER && (
          <>
            <SurveyWelcomeMessage />
            <SurveyUserDataForm />
          </>
        )}
        {currentStep === SurveySteps.DOCUMENTS && <SurveyDocuments />}
        {currentStep === SurveySteps.INTERVIEW && <SurveyChoices />}
        {!HIDE_CONTROL_BUTTONS_STEPS.includes(currentStep) && (
          <ControlButtons
            totalSteps={STEPS.length}
            currentStep={currentStep}
            disableNextControlButton={shouldDisableNextButton}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}
      </main>
    </>
  )
}
