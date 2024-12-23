import { numberOfSurveySteps, SurveySteps } from '@/types'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface State {
  currentSurveyId: string
  name: string
  email: string
  currentStep: SurveySteps
  files: File[]
}

interface Actions {
  setCurrentSurveyId: (id: string) => void
  setName: (name: string) => void
  setEmail: (email: string) => void
  addFile: (file: File) => void
  removeFile: (file: File) => void
  setCurrentStep: (step: SurveySteps) => void
  nextStep: () => void
  prevStep: () => void
  clear: () => void
}

const initialState: State = {
  currentSurveyId: '',
  name: '',
  email: '',
  currentStep: SurveySteps.USER,
  files: []
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
      setEmail: (email) => set({ email: email }),
      addFile: (file) => set({ files: [...get().files, file] }),
      removeFile: (file) =>
        set({ files: get().files.filter((f) => f !== file) }),
      setCurrentStep: (step) => set({ currentStep: step }),
      nextStep: () => {
        const nextStep = get().currentStep + 1
        const haveDocumentsStep = get().files.length > 0

        if (!haveDocumentsStep && nextStep === SurveySteps.DOCUMENTS) {
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
        const haveDocumentsStep = get().files.length > 0
        const prevStep = get().currentStep - 1

        if (!haveDocumentsStep && prevStep === SurveySteps.DOCUMENTS) {
          set({ currentStep: prevStep - 1 }) // Skip step
        } else {
          set({
            currentStep:
              get().currentStep <= 0 ? get().currentStep : get().currentStep - 1
          })
        }
      },
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
