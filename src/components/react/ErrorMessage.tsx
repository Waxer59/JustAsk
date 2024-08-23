import { getLangFromUrl, useTranslations } from '@/i18n/utils'
import { Button } from '@ui/button'
import { getRelativeLocaleUrl } from 'astro:i18n'
import { Frown, RefreshCw } from 'lucide-react'

interface Props {
  text: string
}

const url = new URL(window.location.href)
const lang = getLangFromUrl(url)

export const ErrorMessage: React.FC<Props> = ({ text }) => {
  const t = useTranslations(lang)

  return (
    <div className="flex flex-col gap-8 justify-center items-center">
      <Frown className="w-24 h-24" />
      <p className="text-xl text-center max-w-md text-pretty">{text}</p>
      <Button className="flex items-center gap-2" asChild>
        <a href={getRelativeLocaleUrl(lang, 'job')} data-astro-reload>
          <RefreshCw />
          {t('restart')}
        </a>
      </Button>
    </div>
  )
}
