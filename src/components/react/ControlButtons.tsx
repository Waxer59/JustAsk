import { useInterviewStore } from '@store/interview'
import { InterviewProcessStepsTexts } from '@/types'
import { Button } from '@ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export const ControlButtons = () => {
  const currentStep = useInterviewStore((state) => state.currentStep)
  const currentStepIndex = InterviewProcessStepsTexts.indexOf(currentStep)
  const nextStep = useInterviewStore((state) => state.nextStep)
  const prevStep = useInterviewStore((state) => state.prevStep)

  return (
    <div className="flex items-center justify-center gap-4">
      {currentStepIndex > 0 && (
        <Button onClick={prevStep} variant="secondary">
          <ArrowLeft className="stroke-1" /> Anterior
        </Button>
      )}
      {currentStepIndex < InterviewProcessStepsTexts.length - 2 && (
        <Button onClick={nextStep} variant="secondary">
          Siguiente <ArrowRight className="stroke-1" />
        </Button>
      )}
    </div>
  )
}
