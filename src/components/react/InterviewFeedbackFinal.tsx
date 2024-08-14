import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import NumberTicker from '@ui/magicui/number-ticker'
import { Button } from '@ui/button'
import { RefreshCw } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Card } from '@ui/card'
import { randomInRange } from '@helpers/randomInRange'
import { CONFETTI_DEFAULTS, CONFETTI_DURATION } from '@constants'

interface Props {
  feedback: string
}

export const InterviewFeedbackFinal: React.FC<Props> = ({ feedback }) => {
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
    <div className="flex flex-col items-center gap-8 w-full">
      <h2 className="italic flex items-center gap-8 text-6xl">
        <span className="font-semibold">Puntuación: </span>
        <span className="whitespace-pre-wrap font-medium tracking-tighter text-black dark:text-white">
          <NumberTicker value={100} />
        </span>
      </h2>
      <Card className="text-lg p-4 w-full max-h-[500px] overflow-auto">
        <ReactMarkdown children={feedback} remarkPlugins={[remarkGfm]} />
      </Card>
      <Button className="flex items-center gap-2" asChild>
        <a href="/job" data-astro-reload>
          Comenzar de nuevo <RefreshCw />
        </a>
      </Button>
    </div>
  )
}
