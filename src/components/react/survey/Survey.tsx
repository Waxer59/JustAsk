import { useSurveyStore } from '@/store/survey'
import { Stepper } from '../common/Stepper'
import { SurveyChoices } from './SurveyChoices'
import { SurveyUserDataForm } from './SurveyUserDataForm'
import { SurveyWelcomeMessage } from './SurveyWelcomeMessage'
import { useEffect, useMemo, useState } from 'react'
import { ControlButtons } from '../common/ControlButtons'
import { SurveySteps, type SupportedLanguages } from '@/types'
import { surveyUserDataSchema } from '@/lib/validationSchemas/survey-user-data'
import { SurveyDocument } from './SurveyDocument'
import { Toaster } from '@/ui/sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useUiStore } from '@/store/ui'
import { InterviewProcessLayout } from '@/layouts/react/InterviewProcessLayout'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

export const HIDE_CONTROL_BUTTONS_STEPS = [SurveySteps.USER]

const DOCUMENTS_STEP = 'Documentos'
const STEPS = ['Usuario', 'Comenzar']

export interface ReceivedSurveyDocument {
  id: string
  name: string
  description: string
  isOptional?: boolean
}

interface Props {
  surveyId: string
  requiredDocuments?: ReceivedSurveyDocument[]
  surveyName: string
  surveyDescription?: string
  lang: SupportedLanguages
}

export const Survey: React.FC<Props> = ({
  surveyId,
  requiredDocuments = [],
  surveyName,
  surveyDescription,
  lang
}) => {
  const [currentDocumentIdx, setCurrentDocumentIdx] = useState<number>(0)
  const currentStep = useSurveyStore((state) => state.currentStep)
  const name = useSurveyStore((state) => state.name)
  const email = useSurveyStore((state) => state.email)
  const files = useSurveyStore((state) => state.files)
  const hideControlButtons = useUiStore((state) => state.hideControlButtons)
  const disableControlButtons = useUiStore(
    (state) => state.disableControlButtons
  )
  const setCurrentSurveyId = useSurveyStore((state) => state.setCurrentSurveyId)
  const setHaveRequiredDocuments = useSurveyStore(
    (state) => state.setHaveRequiredDocuments
  )
  const nextStep = useSurveyStore((state) => state.nextStep)
  const prevStep = useSurveyStore((state) => state.prevStep)
  const setName = useSurveyStore((state) => state.setName)
  const setEmail = useSurveyStore((state) => state.setEmail)
  const setCurrentStep = useSurveyStore((state) => state.setCurrentStep)
  const setLang = useSurveyStore((state) => state.setLang)

  const shouldDisableNextButton =
    currentStep === SurveySteps.DOCUMENTS &&
    files.length < currentDocumentIdx + 1 &&
    !requiredDocuments[currentDocumentIdx].isOptional

  const steps = useMemo(() => {
    const newSteps = [...STEPS]

    if (requiredDocuments.length > 0) {
      newSteps.splice(1, 0, DOCUMENTS_STEP)
    }

    return newSteps
  }, [requiredDocuments])

  const logicalToStepperIndex = useMemo(
    () => ({
      [SurveySteps.USER]: 0,
      [SurveySteps.DOCUMENTS]: requiredDocuments.length > 0 ? 1 : -1, // Only show the step if there are documents
      [SurveySteps.INTERVIEW]: requiredDocuments.length > 0 ? 2 : 1 // Adjust the step if there are documents
    }),
    [requiredDocuments]
  )

  const handleNextStep = () => {
    const shouldAdvanceDocument =
      currentStep === SurveySteps.DOCUMENTS &&
      currentDocumentIdx < requiredDocuments.length - 1

    if (shouldAdvanceDocument) {
      setCurrentDocumentIdx(currentDocumentIdx + 1)
    } else {
      nextStep()
    }
  }

  const handlePrevStep = () => {
    const shouldGoBackDocument =
      currentStep === SurveySteps.DOCUMENTS && currentDocumentIdx > 0

    if (shouldGoBackDocument) {
      setCurrentDocumentIdx(currentDocumentIdx - 1)
    } else {
      prevStep()
    }
  }

  useEffect(() => {
    setCurrentSurveyId(surveyId)
  }, [surveyId])

  useEffect(() => {
    setLang(lang)
    setHaveRequiredDocuments(requiredDocuments.length > 0)
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
    <QueryClientProvider client={queryClient}>
      <InterviewProcessLayout
        header={
          <Stepper
            steps={steps}
            currentStep={logicalToStepperIndex[currentStep]}
          />
        }>
        {currentStep === SurveySteps.USER && (
          <>
            <SurveyWelcomeMessage
              surveyName={surveyName}
              surveyDescription={surveyDescription}
            />
            <SurveyUserDataForm />
          </>
        )}
        {currentStep === SurveySteps.DOCUMENTS && (
          <SurveyDocument document={requiredDocuments[currentDocumentIdx]} />
        )}
        {currentStep === SurveySteps.INTERVIEW && <SurveyChoices />}
        {(!HIDE_CONTROL_BUTTONS_STEPS.includes(currentStep) ||
          hideControlButtons) && (
          <ControlButtons
            totalSteps={steps.length}
            currentStep={currentStep}
            disableControlButtons={disableControlButtons}
            disableNextControlButton={shouldDisableNextButton}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        )}
      </InterviewProcessLayout>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
