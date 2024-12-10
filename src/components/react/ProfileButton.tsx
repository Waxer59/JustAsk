import { getLangFromUrl, useTranslations } from '@/i18n/utils'
import { authClient } from '@/lib/auth-client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/ui/dropdown-menu'
import { getRelativeLocaleUrl } from 'astro:i18n'
import { UserIcon } from 'lucide-react'

const url = new URL(window.location.href)
const lang = getLangFromUrl(url)
const t = useTranslations(lang)

export const ProfileButton = () => {
  const handleSignOut = () => {
    authClient.signOut()
    window.location.replace(getRelativeLocaleUrl(lang, 'login'))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-2 transition-colors duration-200 hover:bg-zinc-900 rounded-md">
        <UserIcon size={24} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{t('dashboard.account.title')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          {t('dashboard.account.signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
