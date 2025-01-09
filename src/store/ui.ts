import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface State {
  disableControlButtons: boolean
  hideControlButtons: boolean
  editingSurveyId: string | null
  isCreatingSurvey: boolean
}

interface Actions {
  setDisableControlButtons: (disable: boolean) => void
  setHideControlButtons: (disable: boolean) => void
  setEditingSurveyId: (surveyId: string | null) => void
  setIsCreatingSurvey: (isCreatingSurvey: boolean) => void
  clear: () => void
}

const initialState: State = {
  hideControlButtons: false,
  disableControlButtons: false,
  editingSurveyId: null,
  isCreatingSurvey: false
}

export const useUiStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    setHideControlButtons: (hide: boolean) => set({ hideControlButtons: hide }),
    setDisableControlButtons: (disable: boolean) =>
      set({ disableControlButtons: disable }),
    setEditingSurveyId: (surveyId: string | null) =>
      set({ editingSurveyId: surveyId }),
    setIsCreatingSurvey: (isCreatingSurvey: boolean) =>
      set({
        isCreatingSurvey
      }),
    clear: () => set(initialState)
  }))
)
