import { AutosizeTextarea } from '@ui/autosize-textarea'
import { Button } from '@ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@ui/tooltip'
import { Send } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { toast } from 'sonner'

interface Props {
  questions: string[]
}

export const InterviewChatFinal: React.FC<Props> = ({ questions }) => {
  const userMessages = useRef<string[]>([])
  const [allMessages, setAllMessages] = useState<MessageProps[]>([
    {
      message: questions[0],
      isUser: false
    }
  ])
  const [currentMessage, setcurrentMessage] = useState<string>('')
  const formRef = useRef<HTMLFormElement>(null)
  const messagesRef = useRef<HTMLUListElement>(null)

  const finishInterview = () => {
    toast('Acabó!')
  }

  useEffect(() => {
    messagesRef.current?.scrollTo({
      behavior: 'smooth',
      top: messagesRef.current?.scrollHeight
    })
  }, [allMessages])

  const nextQuestion = () => {
    const currentQuestionIdx = userMessages.current.length

    if (currentQuestionIdx >= questions.length) {
      finishInterview()
      return
    }

    setAllMessages((prev) => [
      ...prev,
      { message: questions[currentQuestionIdx], isUser: false }
    ])
  }

  const handleContentKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()

      if (formRef.current) {
        formRef.current.requestSubmit()
        setcurrentMessage('')
      }
    }
  }

  const handleSendMessage = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()

    if (currentMessage.trim() === '') {
      toast.error('No puedes enviar un mensaje vacío')
      return
    }

    setAllMessages((prev) => [
      ...prev,
      { message: currentMessage, isUser: true }
    ])
    userMessages.current.push(currentMessage)

    nextQuestion()
  }

  return (
    <div className="w-full">
      <form
        ref={formRef}
        className="absolute bottom-16 max-w-5xl w-[90%]"
        onSubmit={handleSendMessage}>
        <AutosizeTextarea
          onKeyDown={handleContentKeyDown}
          placeholder="..."
          value={currentMessage}
          onChange={(e) => setcurrentMessage(e.target.value)}
          name="message"
          maxHeight={200}
          className="resize-none text-lg"
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="absolute top-2 right-2">
              <Button
                size="icon"
                variant="secondary"
                type="submit"
                disabled={currentMessage.trim() === ''}>
                <Send />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Enviar</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </form>
      <ul
        className="max-h-[550px] overflow-auto pr-2 flex flex-col gap-3"
        ref={messagesRef}>
        {allMessages.map((message, index) => (
          <Message
            key={index}
            message={message.message}
            isUser={message.isUser}
          />
        ))}
      </ul>
    </div>
  )
}

interface MessageProps {
  message: string
  isUser: boolean
}

const Message: React.FC<MessageProps> = ({ message, isUser }) => {
  return (
    <li
      className={`flex ${isUser ? 'justify-end pl-4' : 'justify-start pr-4'}`}>
      <p
        className={`p-3 rounded-t-lg w-[50%] text-pretty ${isUser ? 'bg-secondary text-white rounded-bl-lg' : 'bg-primary text-gray-800 rounded-br-lg'}`}>
        {message}
      </p>
    </li>
  )
}
