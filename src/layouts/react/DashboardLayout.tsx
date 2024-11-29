import { Toaster } from '@ui/sonner'
import { LanguagePicker } from '@components/react/LanguagePicker'
import { ProfileButton } from '@components/react/ProfileButton'
import { CreateSurveyButton } from '@components/react/CreateSurveyButton'

interface Props {
  children: React.ReactNode
}

export function DashboardLayout({ children }: Props) {
  return (
    <>
      <header className="mt-16 flex justify-between items-center w-full relative">
        <LanguagePicker />
        <ProfileButton />
      </header>
      <div className="flex flex-col gap-4 items-center sm:flex-row justify-between sm:items-end mt-8 mb-16">
        <h1 className="text-4xl font-bold">
          <a href="/dashboard">Dashboard</a>
        </h1>
        <CreateSurveyButton />
      </div>
      {children}
      <Toaster />
    </>
  )
}
