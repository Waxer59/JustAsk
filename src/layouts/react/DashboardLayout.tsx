import { Toaster } from '@ui/sonner'
import { LanguagePicker } from '@/components/react/common/LanguagePicker'
import { ProfileButton } from '@/components/react/dasboard/ProfileButton'
import { CreateSurveyButton } from '@/components/react/dasboard/CreateSurveyButton'
import { getUiTranslations } from '@/i18n/utils'
import { useEffect } from 'react'
import { useDashboardStore } from '@/store/dashboard'

interface Props {
  children: React.ReactNode
}

const { t } = getUiTranslations()

export function DashboardLayout({ children }: Props) {
  const setSurveys = useDashboardStore((state) => state.setSurveys)

  useEffect(() => {
    const initStore = async () => {
      try {
        const surveysResp = await fetch('/api/survey')
        const surveys = await surveysResp.json()

        setSurveys(surveys)
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
    </>
  )
}
