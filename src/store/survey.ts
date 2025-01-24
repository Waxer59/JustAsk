import {
  numberOfSurveySteps,
  SurveySteps,
  type SupportedLanguages,
  type SurveyDocumentContent
} from '@/types'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface State {
  currentSurveyId: string
  name: string
  email: string
  currentStep: SurveySteps
  files: SurveyDocumentContent[]
  haveRequiredDocuments: boolean
  isAttempt: boolean
  lang: SupportedLanguages
}

interface Actions {
  setCurrentSurveyId: (id: string) => void
  setName: (name: string) => void
  setEmail: (email: string) => void
  addFile: (file: SurveyDocumentContent) => void
  removeFile: (fileId: string) => void
  setCurrentStep: (step: SurveySteps) => void
  setHaveRequiredDocuments: (haveRequiredDocuments: boolean) => void
  setIsAttempt: (isAttempt: boolean) => void
  setLang: (lang: SupportedLanguages) => void
  nextStep: () => void
  prevStep: () => void
  clear: () => void
}

const initialState: State = {
  currentSurveyId: '',
  name: '',
  email: '',
  currentStep: SurveySteps.USER,
  files: [],
  haveRequiredDocuments: false,
  isAttempt: false,
  lang: 'es'
}

export const useSurveyStore = create<State & Actions>()(
  persist(
    devtools((set, get) => ({
      ...initialState,
      setCurrentSurveyId: (id) =>
        set({
          currentSurveyId: id
        }),
      setName: (name) =>
        set({
          name: name
        }),
      setHaveRequiredDocuments: (haveRequiredDocuments) =>
        set({
          haveRequiredDocuments: haveRequiredDocuments
        }),
      setEmail: (email) => set({ email: email }),
      addFile: (file) => set({ files: [...get().files, file] }),
      removeFile: (fileId) =>
        set({ files: get().files.filter((f) => f.name !== fileId) }),
      setCurrentStep: (step) => set({ currentStep: step }),
      nextStep: () => {
        const nextStep = get().currentStep + 1

        if (
          !get().haveRequiredDocuments &&
          nextStep === SurveySteps.DOCUMENTS
        ) {
          set({ currentStep: nextStep + 1 }) // Skip step
        } else {
          set({
            currentStep:
              get().currentStep >= numberOfSurveySteps
                ? get().currentStep
                : get().currentStep + 1
          })
        }
      },
      prevStep: () => {
        const prevStep = get().currentStep - 1

        if (
          !get().haveRequiredDocuments &&
          prevStep === SurveySteps.DOCUMENTS
        ) {
          set({ currentStep: prevStep - 1 }) // Skip step
        } else {
          set({
            currentStep:
              get().currentStep <= 0 ? get().currentStep : get().currentStep - 1
          })
        }
      },
      setIsAttempt: (isAttempt) => set({ isAttempt: isAttempt }),
      setLang: (lang) => set({ lang: lang }),
      clear: () => set(initialState)
    })),
    {
      name: 'survey-data',
      partialize: (state) => ({
        name: state.name,
        email: state.email
      })
    }
  )
)
