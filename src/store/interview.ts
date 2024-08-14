import {
  InterviewProcessSteps,
  InterviewProcessStepsTexts,
  type OfferDetails
} from '@/types'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface State {
  currentStep: InterviewProcessSteps
  currentOffer: OfferDetails | null
  isCurrentOfferManual: boolean
  isSimulatingInterview: boolean
  questions: string[]
  documents: string[]
  feedback: string
  score: number
}

interface Actions {
  setCurrentStep: (step: InterviewProcessSteps) => void
  setCurrentOffer: (offer: OfferDetails) => void
  setIsCurrentOfferManual: (isManual: boolean) => void
  setIsSimulatingInterview: (isSimulating: boolean) => void
  setFeedback: (feedback: string) => void
  setDocuments: (documents: string[]) => void
  setQuestions: (questions: string[]) => void
  setScore: (score: number) => void
  nextStep: () => void
  prevStep: () => void
  clear: () => void
}

const initialState: State = {
  currentStep: InterviewProcessSteps.OFFER,
  currentOffer: null,
  isCurrentOfferManual: false,
  isSimulatingInterview: false,
  feedback: '',
  score: 0,
  documents: [],
  questions: []
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
    setDocuments: (documents: string[]) => set({ documents }),
    prevStep: () => {
      const currentStep = get().currentStep
      const currentIndex = InterviewProcessStepsTexts.indexOf(currentStep)

      if (currentIndex > 0) {
        set({ currentStep: InterviewProcessStepsTexts[currentIndex - 1] })
      }
    },
    setCurrentOffer: (offer: OfferDetails) => set({ currentOffer: offer }),
    setQuestions: (questions: string[]) => set({ questions }),
    setIsSimulatingInterview: (isSimulating: boolean) =>
      set({ isSimulatingInterview: isSimulating }),
    setIsCurrentOfferManual: (isManual: boolean) =>
      set({ isCurrentOfferManual: isManual }),
    setFeedback: (feedback: string) => set({ feedback }),
    setScore: (score: number) => set({ score }),
    clear: () => set(initialState)
  }))
)
