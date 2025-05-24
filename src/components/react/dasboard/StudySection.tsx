import { getUiTranslations } from '@/i18n/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs'
import { StudySectionUploadTab } from './StudySectionUploadTab'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CommonChat, type CommonChatMessage } from '../common/CommonChat'
import { useState } from 'react'
import { toast } from 'sonner'

const { t } = getUiTranslations()

const queryClient = new QueryClient()

export const StudySection = () => {
  const [messages, setMessages] = useState<CommonChatMessage[]>([])

  const handleSubmit = async (message: string) => {
    try {
      const resp = await fetch('/api/dashboard/rag/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: message
        })
      })

      const data = await resp.json()

      if (data.answer) {
        setMessages((prev) => [
          ...prev,
          {
            message: data.answer,
            isUser: false
          }
        ])
      } else {
        toast.error(t('dashboard.chat.rag.error'))
      }
    } catch {
      toast.error(t('dashboard.chat.rag.error'))
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="chat" className="w-full">
            {t('dashboard.study.tab.chat')}
          </TabsTrigger>
          <TabsTrigger value="upload" className="w-full">
            {t('dashboard.study.tab.upload')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="relative">
          <CommonChat
            messages={messages}
            onSubmit={handleSubmit}
            setMessages={setMessages}
          />
        </TabsContent>
        <TabsContent value="upload">
          <div className="mt-8">
            <StudySectionUploadTab />
          </div>
        </TabsContent>
      </Tabs>
    </QueryClientProvider>
  )
}
