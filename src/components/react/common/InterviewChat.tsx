import { useInterviewStore } from '@/store/interview'
import { AutosizeTextarea } from '@ui/autosize-textarea'
import { Button } from '@ui/button'
import { Toggle } from '@ui/toggle'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@ui/tooltip'
import { Mic, Send } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import hark, { type Harker } from 'hark'
import { getUserMicrophone } from '@/helpers/getUserMicrophone'
import { LANG_CODES } from '@/constants'
import { Card } from '@/ui/card'
import { getUiTranslations } from '@/i18n/utils'
import { Message, type MessageProps } from './Message'

const { t } = getUiTranslations()

const SILENCE_TIME = 3 * 1000 // 3 sec

interface Props {
  questions: string[]
  langRecognition?: LANG_CODES
  onSubmit?: (responses: string[]) => void
}

const SpeechRecognition =
  // @ts-expect-error https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#javascript
  window.SpeechRecognition || window.webkitSpeechRecognition

export const InterviewChat: React.FC<Props> = ({
  questions,
  langRecognition = LANG_CODES.es,
  onSubmit
}) => {
  const addAnswer = useInterviewStore((state) => state.addAnswer)
  const [isTalking, setIsTalking] = useState<boolean>(false)
  const [talkingSubtitle, setTalkingSubtitle] = useState<string>('')
  const [allMessages, setAllMessages] = useState<MessageProps[]>([
    {
      message: questions[0],
      isUser: false
    }
  ])
  const [currentMessage, setCurrentMessage] = useState<string>('')
  const [mic, setMic] = useState<MediaStream | null>(null)
  const userMessages = useRef<string[]>([])
  const recognitionRef = useRef<typeof SpeechRecognition>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const messagesRef = useRef<HTMLUListElement>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(1)

  const onToggleClick = () => {
    if (!recognitionRef.current) return

    const newState = !isTalking

    setIsTalking(newState)

    if (newState) {
      recognitionRef.current.start()
    } else {
      recognitionRef.current.stop()
    }
  }

  useEffect(() => {
    getMic()
  }, [])

  useEffect(() => {
    if (!mic) return
    if (!SpeechRecognition) {
      toast.error(t('chat.error.speechRecognition'))
      return
    }

    const recognition = new SpeechRecognition()
    const speechEvents: Harker = hark(mic)

    let isSpeaking = false
    let isRecognizing = false
    let silenceTime: number | null = null
    let timeCountInterval: NodeJS.Timeout | null = null

    recognition.lang = langRecognition
    recognition.interimResults = true
    recognition.maxAlternatives = 1
    recognition.continuous = true

    recognition.onstart = () => {
      isRecognizing = true
    }

    recognition.onend = () => {
      setIsTalking(false)
      setTalkingSubtitle('')
      isRecognizing = false

      if (timeCountInterval) {
        clearInterval(timeCountInterval)
      }
    }

    recognition.onresult = (event: any) => {
      const unfilteredTextToSpeech = Object.keys(event.results)
        .map((result) => event.results[result][0].transcript)
        .join('')
      const finalTextToSpeech = Object.keys(event.results)
        .filter((result) => event.results[result].isFinal)
        .map((result: any) => event.results[result][0].transcript)
        .join('')
      setCurrentMessage((prev) => prev + finalTextToSpeech)
      setTalkingSubtitle(unfilteredTextToSpeech)
    }

    speechEvents.on('stopped_speaking', () => {
      isSpeaking = false

      if (!isRecognizing) return

      if (!silenceTime) {
        silenceTime = Date.now()
      }

      if (timeCountInterval) {
        return
      }

      timeCountInterval = setInterval(() => {
        if (
          silenceTime &&
          !isSpeaking &&
          Date.now() - silenceTime >= SILENCE_TIME
        ) {
          recognition.stop()
          clearTimeout(timeCountInterval!)
          timeCountInterval = null
        }
      }, SILENCE_TIME)
    })

    speechEvents.on('speaking', () => {
      if (!isRecognizing) return

      isSpeaking = true
    })

    recognitionRef.current = recognition

    return () => {
      if (timeCountInterval) {
        clearInterval(timeCountInterval)
      }
    }
  }, [mic])

  useEffect(() => {
    messagesRef.current?.scrollTo({
      behavior: 'smooth',
      top: messagesRef.current?.scrollHeight
    })
  }, [allMessages])

  const getMic = async () => {
    const mic = await getUserMicrophone()

    if (!mic) {
      toast.error(t('chat.error.speechRecognition'))
      return
    }

    setMic(mic)
  }

  const nextQuestion = () => {
    const currentQuestionIdx = userMessages.current.length

    if (currentQuestionIdx >= questions.length) {
      onSubmit?.(userMessages.current)
      return
    }

    setCurrentQuestionIndex(currentQuestionIdx + 1)

    // Add the interview question to the state
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
        setCurrentMessage('')
        setTalkingSubtitle('')
      }
    }
  }

  const handleSendMessage = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()

    if (currentMessage.trim() === '') {
      toast.error(t('chat.error.emptyMessage'))
      return
    }

    // Add the user's message to the state
    addAnswer(currentMessage)
    recognitionRef.current?.stop()
    setAllMessages((prev) => [
      ...prev,
      { message: currentMessage, isUser: true }
    ])
    userMessages.current.push(currentMessage)
    setCurrentMessage('')
    setTalkingSubtitle('')

    nextQuestion()
  }

  return (
    <>
      <h2 className="text-center text-4xl font-bold absolute top-44 left-0 right-0">
        {currentQuestionIndex} <span className="text-zinc-600">/</span>{' '}
        {questions.length}
      </h2>
      <ul
        className="flex-1 overflow-y-auto flex flex-col gap-3"
        ref={messagesRef}>
        {allMessages.map((message, index) => (
          <Message
            key={index}
            message={message.message}
            isUser={message.isUser}
          />
        ))}
      </ul>
      <form
        ref={formRef}
        className="flex flex-col items-center relative pb-12"
        onSubmit={handleSendMessage}>
        {talkingSubtitle.length > 0 && (
          <Card className="absolute -top-14 max-w-3xl mx-auto p-2 overflow-hidden">
            <p className="text-nowrap [direction:rtl]">{talkingSubtitle}</p>
          </Card>
        )}
        <AutosizeTextarea
          onKeyDown={handleContentKeyDown}
          placeholder="..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          name="message"
          maxHeight={200}
          className="resize-none text-lg h-[54px] pr-[50px] pl-[70px]"
        />
        <Toggle
          onClick={onToggleClick}
          pressed={isTalking}
          onPressedChange={() => setIsTalking(!isTalking)}
          variant="outline"
          aria-label={t('chat.talk')}
          className="absolute top-2 left-2">
          <Mic />
        </Toggle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="absolute top-2 right-2" asChild>
              <Button
                size="icon"
                variant="secondary"
                type="submit"
                disabled={currentMessage.trim() === ''}>
                <Send />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('chat.send')}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </form>
    </>
  )
}
