import { Card } from '@/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@ui/dialog'
import { CommonChat, type CommonChatMessage } from '../common/CommonChat'
import { useState } from 'react'
import { toast } from 'sonner'
import { getUiTranslations } from '@/i18n/utils'
import { Button } from '@/ui/button'
import { BeatLoader } from 'react-spinners'

interface Props {
  id: string
  title: string
  description: string
}

const { t } = getUiTranslations()

export const AgentCard: React.FC<Props> = ({ id, title, description }) => {
  const [messages, setMessages] = useState<CommonChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false)

  const handleSubmit = async () => {
    await generateQuestion()
  }

  const generateFeedback = async (context: string): Promise<string | null> => {
    setIsFeedbackLoading(true)
    try {
      const resp = await fetch(`/api/dashboard/rag/agents/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          context
        })
      })

      if (resp.status === 200) {
        const data = await resp.json()
        setFeedback(data.feedback)
        return data.feedback
      }
    } catch {
      toast.error(t('dashboard.chat.rag.error'))
    } finally {
      setIsFeedbackLoading(false)
    }
    return null
  }

  const generateQuestion = async () => {
    setIsLoading(true)
    try {
      const resp = await fetch(`/api/dashboard/rag/agents/${id}`)
      const data = await resp.json()
      setMessages((prev) => [
        ...prev,
        { message: data.question, isUser: false }
      ])
    } catch {
      toast.error(t('dashboard.chat.rag.error'))
    }
    setIsLoading(false)
  }

  const handleOnOpenChange = async (open: boolean) => {
    if (open) {
      await generateQuestion()
      setIsLoading(false)
    } else {
      setMessages([])
    }
  }

  const handleOpenFeedbackChange = async (open: boolean) => {
    if (open) {
      const feedback = await generateFeedback(`
        Chat history:
        ${messages
          .filter((message) => message.isUser)
          .reduce((acc, message) => {
            return `${acc}\n
          Answer: ${message.message}
          `
          }, '')}
        `)
      setFeedback(feedback)
    } else {
      setFeedback(null)
    }
  }

  return (
    <Card
      className="p-4 flex flex-col gap-4 justify-between h-full w-full"
      key={id}>
      <Dialog onOpenChange={handleOnOpenChange}>
        <DialogTrigger>
          <h2
            className="text-2xl font-bold truncate cursor-pointer hover:underline text-start"
            title={title}>
            {title}
          </h2>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              <CommonChat
                isLoading={isLoading}
                setMessages={setMessages}
                messages={messages}
                onSubmit={handleSubmit}
              />
              <Dialog onOpenChange={handleOpenFeedbackChange}>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    className="w-full mt-4"
                    disabled={isLoading}>
                    {t('dashboard.chat.rag.generateFeedback')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {t('dashboard.chat.rag.feedback')}
                    </DialogTitle>
                    <DialogDescription>
                      {isFeedbackLoading && (
                        <div className="flex items-center justify-center">
                          <BeatLoader size={10} color="#fff" />
                        </div>
                      )}
                      <p>{feedback}</p>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <p className="italic text-pretty text-gray-300 text-ellipsis">
        {description}
      </p>
    </Card>
  )
}
