import { getLangFromUrl, useTranslations } from '@/i18n/utils'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { useRef } from 'react'
import { toast } from 'sonner'

const url = new URL(window.location.href)
const lang = getLangFromUrl(url)
const t = useTranslations(lang)

export const LoginForm = () => {
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const email = formData.get('email') as string
    authClient.signIn.magicLink(
      {
        email,
        callbackURL: '/dashboard'
      },
      {
        headers: {
          lang
        }
      }
    )

    toast.success(t('login.toast.success'))

    form.reset()
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        ref={formRef}
        className="flex flex-col items-center justify-center w-full gap-4">
        <Input
          placeholder="interview@justask.app"
          type="email"
          name="email"
          required
          autoComplete="email"
        />
        <Button type="submit">{t('login.btn')}</Button>
      </form>
    </>
  )
}
