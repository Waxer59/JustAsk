import { Button } from '@ui/button'
import { Card } from '@ui/card'
import { RefreshCw } from 'lucide-react'

interface Props {
  questions: string[]
}

export const Questions: React.FC<Props> = ({ questions }) => {
  return (
    <div className="flex flex-col gap-8 items-center justify-center pb-6">
      <h2 className="text-4xl font-bold">Preguntas</h2>
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
        <a href="/job">
          Comenzar de nuevo <RefreshCw />
        </a>
      </Button>
    </div>
  )
}
