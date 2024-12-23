import type { Survey } from '@/types'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface State {
  surveys: Survey[]
}

interface Actions {
  addSurvey: (survey: Survey) => void
  removeSurvey: (surveyId: string) => void
  clear: () => void
}

const initialState: State = {
  surveys: []
}

export const useDashboardStore = create<State & Actions>()(
  devtools((set, get) => ({
    ...initialState,
    addSurvey: (survey: Survey) => set({ surveys: [...get().surveys, survey] }),
    removeSurvey: (surveyId: string) =>
      set({ surveys: get().surveys.filter(({ id }) => id !== surveyId) }),
    clear: () => set(initialState)
  }))
)
