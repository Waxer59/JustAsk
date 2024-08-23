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
  hasInterviewFinished: boolean
  questions: string[]
  answers: string[]
  documents: string[]
}

interface Actions {
  setCurrentStep: (step: InterviewProcessSteps) => void
  setCurrentOffer: (offer: OfferDetails) => void
  setIsCurrentOfferManual: (isManual: boolean) => void
  setIsSimulatingInterview: (isSimulating: boolean) => void
  setHasInterviewFinished: (hasFinished: boolean) => void
  setAnswers: (answers: string[]) => void
  addAnswer: (answer: string) => void
  setDocuments: (documents: string[]) => void
  setQuestions: (questions: string[]) => void
  nextStep: () => void
  prevStep: () => void
  clear: () => void
}

const initialState: State = {
  currentStep: InterviewProcessSteps.OFFER,
  currentOffer: null,
  isCurrentOfferManual: false,
  isSimulatingInterview: false,
  documents: [],
  questions: [],
  hasInterviewFinished: false,
  answers: []
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
    setHasInterviewFinished: (hasFinished: boolean) =>
      set({ hasInterviewFinished: hasFinished }),
    addAnswer: (answer: string) => set({ answers: [...get().answers, answer] }),
    prevStep: () => {
      const currentStep = get().currentStep
      const currentIndex = InterviewProcessStepsTexts.indexOf(currentStep)

      if (currentIndex > 0) {
        set({ currentStep: InterviewProcessStepsTexts[currentIndex - 1] })
      }
    },
    setAnswers: (answers: string[]) => set({ answers }),
    setCurrentOffer: (offer: OfferDetails) => set({ currentOffer: offer }),
    setQuestions: (questions: string[]) => set({ questions }),
    setIsSimulatingInterview: (isSimulating: boolean) =>
      set({ isSimulatingInterview: isSimulating }),
    setIsCurrentOfferManual: (isManual: boolean) =>
      set({ isCurrentOfferManual: isManual }),
    clear: () => set(initialState)
  }))
)
