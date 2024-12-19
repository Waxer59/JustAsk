import { Toaster } from '@ui/sonner'
import { LanguagePicker } from '@components/react/LanguagePicker'
import { ProfileButton } from '@components/react/ProfileButton'
import { CreateSurveyButton } from '@components/react/CreateSurveyButton'
import { getLangFromUrl, useTranslations } from '@/i18n/utils'

interface Props {
  children: React.ReactNode
}
const url = new URL(window.location.href)
const lang = getLangFromUrl(url)
const t = useTranslations(lang)

export function DashboardLayout({ children }: Props) {
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
