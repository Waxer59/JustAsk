import {
  InterviewProcessSteps,
  numberOfInterviewSteps,
  type DocumentContent,
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
  answers: string[]
  documentsContent: DocumentContent[]
}

interface Actions {
  setCurrentStep: (step: InterviewProcessSteps) => void
  setCurrentOffer: (offer: OfferDetails) => void
  setIsCurrentOfferManual: (isManual: boolean) => void
  setIsSimulatingInterview: (isSimulating: boolean) => void
  setAnswers: (answers: string[]) => void
  addAnswer: (answer: string) => void
  removeDocumentContentById: (id: string) => void
  setDocumentsContent: (documents: DocumentContent[]) => void
  addDocumentContent: (document: DocumentContent) => void
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
  documentsContent: [],
  questions: [],
  answers: []
}

export const useInterviewStore = create<State & Actions>()(
  devtools((set, get) => ({
    ...initialState,
    setCurrentStep: (step: InterviewProcessSteps) => set({ currentStep: step }),
    addDocumentContent: (document: DocumentContent) =>
      set({ documentsContent: [...get().documentsContent, document] }),
    nextStep: () => {
      const currentStep = get().currentStep

      if (currentStep < numberOfInterviewSteps - 1) {
        set({ currentStep: currentStep + 1 })
      }
    },
    removeDocumentContentById: (id: string) =>
      set({
        documentsContent: get().documentsContent.filter(
          (document) => document.id !== id
        )
      }),
    setDocumentsContent: (documentsContent: DocumentContent[]) =>
      set({ documentsContent }),
    addAnswer: (answer: string) => set({ answers: [...get().answers, answer] }),
    prevStep: () => {
      const currentStep = get().currentStep

      if (currentStep > 0) {
        set({ currentStep: currentStep - 1 })
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
