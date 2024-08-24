import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface State {
  disableControlButtons: boolean
  hideControlButtons: boolean
}

interface Actions {
  setDisableControlButtons: (disable: boolean) => void
  setHideControlButtons: (disable: boolean) => void
  clear: () => void
}

const initialState: State = {
  hideControlButtons: false,
  disableControlButtons: false
}

export const useUiStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    setHideControlButtons: (hide: boolean) => set({ hideControlButtons: hide }),
    setDisableControlButtons: (disable: boolean) =>
      set({ disableControlButtons: disable }),
    clear: () => set(initialState)
  }))
)
