import { InterviewProcessSteps, InterviewProcessStepsTexts } from '@/types'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface State {
  currentStep: InterviewProcessSteps
}

interface Actions {
  setCurrentStep: (step: InterviewProcessSteps) => void
  nextStep: () => void
  prevStep: () => void
  clear: () => void
}

const initialState: State = {
  currentStep: InterviewProcessSteps.OFFER
}

export const useInterviewStore = create<State & Actions>()(
  devtools((set, get) => ({
    ...initialState,
    setCurrentStep: (step: InterviewProcessSteps) => set({ currentStep: step }),
    nextStep: () => {
      const currentStep = get().currentStep
      const currentIndex = InterviewProcessStepsTexts.indexOf(currentStep)

      if (currentIndex < InterviewProcessStepsTexts.length - 1) {
        set({ currentStep: InterviewProcessStepsTexts[currentIndex + 1] })
      }
    },
    prevStep: () => {
      const currentStep = get().currentStep
      const currentIndex = InterviewProcessStepsTexts.indexOf(currentStep)

      if (currentIndex > 0) {
        set({ currentStep: InterviewProcessStepsTexts[currentIndex - 1] })
      }
    },
    clear: () => set(initialState)
  }))
)
