import { Button } from '@ui/button'
import { Frown, RefreshCw } from 'lucide-react'

interface Props {
  text: string
}

export const ErrorMessage: React.FC<Props> = ({ text }) => {
  return (
    <div className="flex flex-col gap-8 justify-center items-center">
      <Frown className="w-24 h-24" />
      <p className="text-xl text-center max-w-md text-pretty">{text}</p>
      <Button className="flex items-center gap-2" asChild>
        <a href="/job" data-astro-reload>
          <RefreshCw />
          Comenzar de nuevo
        </a>
      </Button>
    </div>
  )
}
