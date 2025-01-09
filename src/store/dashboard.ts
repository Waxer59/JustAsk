import type { Survey } from '@/types'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface State {
  surveys: Survey[]
}

interface Actions {
  addSurvey: (survey: Survey) => void
  setSurveys: (surveys: Survey[]) => void
  removeSurvey: (surveyId: string) => void
  updateSurvey: (surveyId: string, updateSurvey: Partial<Survey>) => void
  clear: () => void
}

const initialState: State = {
  surveys: []
}

export const useDashboardStore = create<State & Actions>()(
  devtools((set, get) => ({
    ...initialState,
    updateSurvey: (surveyId, updateSurvey) =>
      set({
        surveys: get().surveys.map((survey) =>
          survey.id === surveyId ? { ...survey, ...updateSurvey } : survey
        )
      }),
    setSurveys: (surveys: Survey[]) => set({ surveys }),
    addSurvey: (survey: Survey) => set({ surveys: [...get().surveys, survey] }),
    removeSurvey: (surveyId: string) =>
      set({ surveys: get().surveys.filter(({ id }) => id !== surveyId) }),
    clear: () => set(initialState)
  }))
)
