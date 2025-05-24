import type { AgentDetails } from '@/types'
import { AgentCard } from './AgentCard'
import { useAgentsStore } from '@/store/agents'
import { useEffect } from 'react'
import { getUiTranslations } from '@/i18n/utils'
import { toast } from 'sonner'

const { t, lang } = getUiTranslations()

export const AgentCards: React.FC = () => {
  const agents = useAgentsStore((state) => state.agents)
  const setAgents = useAgentsStore((state) => state.setAgents)

  useEffect(() => {
    const initStore = async () => {
      try {
        const agentsResp = await fetch(`/api/dashboard/rag/agents?lang=${lang}`)
        const data = await agentsResp.json()
        setAgents(data)
      } catch {
        toast.error(t('dashboard.agentsResponse.error'))
      }
    }

    initStore()
  }, [])

  return (
    <ul className="grid grid-cols-6 gap-4">
      {agents?.map((agent: AgentDetails) => (
        <li className="col-span-full md:col-span-3 xl:col-span-2">
          <AgentCard
            id={agent.id}
            title={agent.name}
            description={agent.description}
            action={agent.action}
            isCustom={agent.isCustom}
          />
        </li>
      ))}
    </ul>
  )
}
