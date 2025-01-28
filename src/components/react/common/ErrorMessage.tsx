import { Button } from '@ui/button'
import { Frown, RefreshCw } from 'lucide-react'
import { getUiTranslations } from '@/i18n/utils'
import type { SupportedLanguages } from '@/types'

interface Props {
  text: string
  lang?: SupportedLanguages
}

const { t, lang: currentLang } = getUiTranslations()

export const ErrorMessage: React.FC<Props> = ({ text, lang = currentLang }) => {
  return (
    <div className="flex flex-col gap-8 justify-center items-center">
      <Frown className="w-24 h-24" />
      <p className="text-xl text-center max-w-md text-pretty">{text}</p>
      <Button className="flex items-center gap-2" asChild>
        <a href={window.location.href} data-astro-reload>
          <RefreshCw />
          {t('restart', lang)}
        </a>
      </Button>
    </div>
  )
}
