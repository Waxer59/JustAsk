import { InterviewProcessSteps } from '@/types'
import { Stepper } from '@/components/react/common/Stepper'
import { DocumentsStep } from '@/components/react/interview-simulation/DocumentsStep'
import { useInterviewStore } from '@store/interview'
import { ControlButtons } from '../common/ControlButtons'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from '@ui/sonner'
import { ConfigureStep } from './ConfigureStep'
import { useUiStore } from '@store/ui'
import { OfferStep } from './OfferStep'
import { FinalStep } from './FinalStep'
import { getUiTranslations } from '@/i18n/utils'
import { InterviewProcessLayout } from '@/layouts/react/InterviewProcessLayout'

export const HIDE_CONTROL_BUTTONS_STEPS = [
  InterviewProcessSteps.OFFER,
  InterviewProcessSteps.COMPLETE
]

const queryClient = new QueryClient()

const { t } = getUiTranslations()

export const steps = [
  t('stepper.step.1'),
  t('stepper.step.2'),
  t('stepper.step.3'),
  t('stepper.step.4')
]

export const InterviewProcess = () => {
  const currentStep = useInterviewStore((state) => state.currentStep)
  const nextStep = useInterviewStore((state) => state.nextStep)
  const prevStep = useInterviewStore((state) => state.prevStep)
  const hideControlButtons = useUiStore((state) => state.hideControlButtons)
  const disableControlButtons = useUiStore(
    (state) => state.disableControlButtons
  )

  return (
    <QueryClientProvider client={queryClient}>
      <InterviewProcessLayout
        shouldLockScreen={currentStep < InterviewProcessSteps.COMPLETE}
        header={<Stepper steps={steps} currentStep={currentStep} />}>
        {currentStep === InterviewProcessSteps.OFFER && <OfferStep />}
        {currentStep === InterviewProcessSteps.DOCUMENTS && <DocumentsStep />}
        {currentStep === InterviewProcessSteps.SETUP && <ConfigureStep />}
        {currentStep === InterviewProcessSteps.COMPLETE && <FinalStep />}

        {!HIDE_CONTROL_BUTTONS_STEPS.includes(currentStep) &&
          !hideControlButtons && (
            <ControlButtons
              disableControlButtons={disableControlButtons}
              currentStep={currentStep}
              totalSteps={steps.length}
              hideNextControlButtonStep={steps.length - 2}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
      </InterviewProcessLayout>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
