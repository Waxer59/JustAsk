import type { AgentDetails } from '@/types'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface State {
  agents: AgentDetails[]
}

interface Actions {
  setAgents: (agents: AgentDetails[]) => void
  removeAgent: (agentId: string) => void
  updateAgent: (agentId: string, updateAgent: Partial<AgentDetails>) => void
  clear: () => void
}

const initialState: State = {
  agents: []
}

export const useAgentsStore = create<State & Actions>()(
  devtools((set, get) => ({
    ...initialState,
    setAgents: (agents: AgentDetails[]) => set({ agents }),
    updateAgent: (agentId, updateAgent) =>
      set({
        agents: get().agents.map((agent) =>
          agent.id === agentId ? { ...agent, ...updateAgent } : agent
        )
      }),
    removeAgent: (agentId: string) =>
      set({ agents: get().agents.filter(({ id }) => id !== agentId) }),
    clear: () => set(initialState)
  }))
)
