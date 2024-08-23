import { InterviewProcessSteps, InterviewProcessStepsTexts } from '@/types'
import { Stepper } from '@components/react/Stepper'
import { OfferStep } from '@components/react/OfferStep'
import { DocumentsStep } from '@components/react/DocumentsStep'
import { useInterviewStore } from '@store/interview'
import { ControlButtons } from './ControlButtons'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from '@ui/sonner'
import { ConfigureStep } from './ConfigureStep'
import { FinalStep } from './FinalStep'
import { useUiStore } from '@store/ui'

const HIDE_CONTROL_BUTTONS_STEPS = [
  InterviewProcessSteps.OFFER,
  InterviewProcessSteps.COMPLETE
]

const queryClient = new QueryClient()

export const InterviewProcess = () => {
  const currentStep = useInterviewStore((state) => state.currentStep)
  const currentStepIndex = InterviewProcessStepsTexts.indexOf(currentStep)
  const disableControlButtons = useUiStore(
    (state) => state.disableControlButtons
  )

  return (
    <QueryClientProvider client={queryClient}>
      <div className="mt-16">
        <Stepper
          steps={InterviewProcessStepsTexts}
          currentStep={currentStepIndex}
        />

        <div className="mt-28 flex flex-col gap-12 items-center justify-center max-w-5xl mx-auto pb-5">
          {currentStep === InterviewProcessSteps.OFFER && <OfferStep />}
          {currentStep === InterviewProcessSteps.DOCUMENTS && <DocumentsStep />}
          {currentStep === InterviewProcessSteps.SETUP && <ConfigureStep />}
          {currentStep === InterviewProcessSteps.COMPLETE && <FinalStep />}

          {!HIDE_CONTROL_BUTTONS_STEPS.includes(currentStep) &&
            !disableControlButtons && <ControlButtons />}
        </div>
      </div>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
