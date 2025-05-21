import { getUiTranslations } from '@/i18n/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs'
import { StudySectionUploadTab } from './StudySectionUploadTab'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TrainingChat } from './StudyChat'

const { t } = getUiTranslations()

const queryClient = new QueryClient()

export const StudySection = () => {
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
          <TrainingChat />
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
