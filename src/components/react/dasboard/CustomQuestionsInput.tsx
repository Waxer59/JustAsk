'use client'

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
import { getLangFromUrl, useTranslations } from '@/i18n/utils'

export interface CustomQuestion {
  id: string
  question: string
}

const url = new URL(window.location.href)
const lang = getLangFromUrl(url)
const t = useTranslations(lang)

interface Props {
  max?: number
  onChange?: (questions: CustomQuestion[]) => void
}

export const CustomQuestionsInput = ({ max, onChange }: Props) => {
  const [question, setQuestion] = useState<string>('')
  const [questions, setQuestions] = useState<CustomQuestion[]>([])

  const handleSubmit = () => {
    if (question.trim().length === 0) {
      toast.error('Please enter a question')
      return
    }

    if (max && questions.length >= max) {
      toast.error(`You can only add up to ${max} questions`)
      return
    }

    const questionExists = questions.some(
      (q) =>
        q.question.replace(/\s+/g, ' ').toLowerCase() ===
        question.replace(/\s+/g, ' ').toLowerCase()
    )

    if (questionExists) {
      toast.error('Question already exists')
      return
    }

    const newQuestions = [
      ...questions,
      {
        id: crypto.randomUUID(),
        question
      }
    ]

    setQuestions(newQuestions)

    onChange?.(newQuestions)

    setQuestion('')
  }

  const handleRemoveQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((question) => question.id !== id))
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <FormItem className="flex-1">
        <FormLabel>{t('dashboard.createSurvey.questions.custom')}</FormLabel>
        <FormControl>
          <div className="flex gap-2 items-center">
            <Input
              name="question"
              placeholder="..."
              className="text-lg flex-1"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    type="button"
                    className="self-start"
                    onClick={handleSubmit}>
                    <PlusIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('dashboard.createSurvey.questions.custom.tooltip')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </FormControl>
        <FormDescription>
          {t('dashboard.createSurvey.questions.custom.description')}
        </FormDescription>
        <FormMessage />
      </FormItem>
      <ul className="flex flex-col gap-4">
        {questions.map(({ id, question }) => (
          <li className="grid grid-cols-12 gap-2" key={id}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="bg-zinc-800 p-2 rounded-md text-pretty truncate cursor-help col-span-10">
                    {question}
                  </p>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="start"
                  className="max-w-[300px]">
                  <p className="text-sm">{question}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant="secondary"
              size="icon"
              className="col-span-1"
              onClick={() => handleRemoveQuestion(id)}>
              <XIcon />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
