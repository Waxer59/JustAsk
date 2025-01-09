import { Toaster } from '@ui/sonner'
import { LanguagePicker } from '@/components/react/common/LanguagePicker'
import { ProfileButton } from '@/components/react/dasboard/ProfileButton'
import { CreateSurveyButton } from '@/components/react/dasboard/CreateSurveyButton'
import { getUiTranslations } from '@/i18n/utils'
import { useEffect } from 'react'
import { useDashboardStore } from '@/store/dashboard'
import type { Survey, SurveysResponse } from '@/types'
import { useUiStore } from '@/store/ui'
import { CreateSurveyDialog } from '@/components/react/dasboard/CreateSurveyDialog'

interface Props {
  children: React.ReactNode
}

const { t } = getUiTranslations()

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
    <>
      <header className="mt-16 flex justify-between items-center w-full relative">
        <LanguagePicker />
        <ProfileButton />
      </header>
      <div className="flex flex-col gap-4 items-center sm:flex-row justify-between sm:items-end mt-8 mb-16">
        <h1 className="text-4xl font-bold">
          <a href="/dashboard">{t('dashboard.title')}</a>
        </h1>
        <CreateSurveyButton />
      </div>
      {children}
      <Toaster />
      {(isCreatingSurvey || isEditingSurvey) && (
        <CreateSurveyDialog isOpen editingSurvey={editingSurvey} />
      )}
    </>
  )
}
