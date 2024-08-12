import { InterviewProcessSteps, InterviewProcessStepsTexts } from '@/types'
import { Stepper } from '@components/react/Stepper'
import { OfferStep } from '@components/react/OfferStep'
import { DocumentsStep } from '@components/react/DocumentsStep'
import { useInterviewStore } from '@store/interview'
import { Button } from '@/ui/button'
import { ArrowRight } from 'lucide-react'

export const InterviewProcess = () => {
  const currentStep = useInterviewStore((state) => state.currentStep)
  const nextStep = useInterviewStore((state) => state.nextStep)

  return (
    <div className="mt-16">
      <Stepper
        steps={InterviewProcessStepsTexts}
        currentStep={InterviewProcessStepsTexts.indexOf(currentStep)}
      />
      <div className="mt-28 flex flex-col gap-12 items-center justify-center">
        {currentStep === InterviewProcessSteps.OFFER && <OfferStep />}
        {currentStep === InterviewProcessSteps.DOCUMENTS && <DocumentsStep />}
        <Button onClick={nextStep}>
          Siguiente <ArrowRight className="stroke-1" />
        </Button>
      </div>
    </div>
  )
}
