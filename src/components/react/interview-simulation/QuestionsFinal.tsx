import { CONFETTI_DEFAULTS, CONFETTI_DURATION } from '@constants'
import { randomInRange } from '@/helpers/randomInRange'
import { Button } from '@ui/button'
import { Card } from '@ui/card'
import confetti from 'canvas-confetti'
import { RefreshCw } from 'lucide-react'
import { useEffect } from 'react'
import { getRelativeLocaleUrl } from 'astro:i18n'
import { getUiTranslations } from '@/i18n/utils'

interface Props {
  questions: string[]
}

const { t, lang } = getUiTranslations()

export const Questions: React.FC<Props> = ({ questions }) => {
  useEffect(() => {
    const CONFETTI_ANIMATION_END = Date.now() + CONFETTI_DURATION

    const interval = setInterval(() => {
      const timeLeft = CONFETTI_ANIMATION_END - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 100 * (timeLeft / CONFETTI_DURATION)

      confetti({
        ...CONFETTI_DEFAULTS,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...CONFETTI_DEFAULTS,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)
  }, [])

  return (
    <div className="flex flex-col gap-8 items-center justify-center pb-6">
      <h2 className="text-4xl font-bold">{t('questions')}</h2>
      <Card className="text-xl max-w-3xl max-h-[600px] overflow-auto">
        <ol className="list-decimal px-10 py-5 flex flex-col gap-4">
          {questions.map((question, index) => (
            <li key={index}>
              <p>{question}</p>
            </li>
          ))}
        </ol>
      </Card>
      <Button className="flex items-center gap-2" asChild>
        <a href={getRelativeLocaleUrl(lang, 'job')} data-astro-reload>
          {t('restart')} <RefreshCw />
        </a>
      </Button>
    </div>
  )
}
