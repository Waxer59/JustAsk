import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface State {
  disableControlButtons: boolean
}

interface Actions {
  setDisableControlButtons: (disable: boolean) => void
  clear: () => void
}

const initialState: State = {
  disableControlButtons: false
}

export const useUiStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    setDisableControlButtons: (disable: boolean) =>
      set({ disableControlButtons: disable }),
    clear: () => set(initialState)
  }))
)
