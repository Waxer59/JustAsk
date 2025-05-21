import { Toaster } from '@ui/sonner'
import { LanguagePicker } from '@/components/react/common/LanguagePicker'
import { ProfileButton } from '@/components/react/dasboard/ProfileButton'
import { useEffect } from 'react'
import { useDashboardStore } from '@/store/dashboard'
import type { Survey, SurveysResponse } from '@/types'
import { useUiStore } from '@/store/ui'
import { CreateSurveyDialog } from '@/components/react/dasboard/CreateSurveyDialog'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SidebarProvider, SidebarTrigger } from '@/ui/sidebar'
import { DashboardSidebar } from '@/components/react/dasboard/DashboardSidebar'

const queryClient = new QueryClient()

interface Props {
  children: React.ReactNode
}

export function DashboardLayout({ children }: Props) {
  const setSurveys = useDashboardStore((state) => state.setSurveys)
  const surveys = useDashboardStore((state) => state.surveys)
  const editingSurveyId = useUiStore((state) => state.editingSurveyId)
  const isCreatingSurvey = useUiStore((state) => state.isCreatingSurvey)
  const isEditingSurvey = Boolean(editingSurveyId)
  const editingSurvey = surveys.find((survey) => survey.id === editingSurveyId)

  useEffect(() => {
    const initStore = async () => {
      try {
        const surveysResp = await fetch('/api/survey')
        const data = await surveysResp.json()

        const surveys: SurveysResponse[] = data.surveys

        const mappedSurveys: Survey[] = surveys.map(
          ({
            surveysToSurveyCategories,
            surveysToSurveysDocuments,
            ...survey
          }) => ({
            ...survey,
            categories: surveysToSurveyCategories.map(
              ({ category }) => category
            ),
            documents: surveysToSurveysDocuments.map(({ document }) => document)
          })
        )
        setSurveys(mappedSurveys)
      } catch (error) {
        console.log(error)
      }
    }

    initStore()
  }, [])

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <div className="w-full">
        <header className="mt-16 flex justify-between items-center w-full relative">
          <div className="flex flex-col gap-4 items-center">
            <SidebarTrigger
              className="mx-auto mt-4 [&_svg]:size-6 md:hidden p-4"
              size="lg"
            />
            <LanguagePicker />
          </div>
          <ProfileButton />
        </header>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <Toaster />
        {(isCreatingSurvey || isEditingSurvey) && (
          <CreateSurveyDialog isOpen editingSurvey={editingSurvey} />
        )}
      </div>
    </SidebarProvider>
  )
}
