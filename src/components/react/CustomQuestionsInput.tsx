import { Input } from '@ui/input'
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage
} from '@ui/form'
import { Button } from '@ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@ui/tooltip'
import { PlusIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface CustomQuestion {
  id: string
  question: string
}

interface Props {
  max: number
  onAddQuestion?: (question: string) => void
}

export const CustomQuestionsInput = ({ max, onAddQuestion }: Props) => {
  const [question, setQuestion] = useState<string>('')
  const [questions, setQuestions] = useState<CustomQuestion[]>([])

  const handleSubmit = () => {
    if (question.trim().length === 0) {
      toast.error('Please enter a question')
      return
    }

    if (questions.length >= max) {
      toast.error(`You can only add up to ${max} questions`)
      return
    }

    if (question) {
      setQuestions((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          question
        }
      ])
    }

    if (onAddQuestion) {
      onAddQuestion(question)
    }

    setQuestion('')
  }

  const handleRemoveQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((question) => question.id !== id))
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 items-center">
        <FormItem>
          <FormLabel>Custom questions</FormLabel>
          <FormControl>
            <Input
              name="question"
              placeholder="..."
              className="text-lg"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </FormControl>
          <FormDescription>
            Specify which questions should be included in the survey survey
          </FormDescription>
          <FormMessage />
        </FormItem>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                type="button"
                onClick={handleSubmit}>
                <PlusIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add question</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <ul className="flex flex-col gap-4">
        {questions.map(({ id, question }) => (
          <li className="flex flex-wrap gap-4 items-center" key={id}>
            <p className="bg-zinc-800 p-2 rounded-md flex-1 text-pretty">
              {question}
            </p>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => handleRemoveQuestion(id)}>
              <XIcon />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
