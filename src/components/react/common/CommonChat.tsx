import { LANG_CODES, SILENCE_TIME } from '@/constants'
import { getUserMicrophone } from '@/helpers/getUserMicrophone'
import { getUiTranslations } from '@/i18n/utils'
import { AutosizeTextarea } from '@/ui/autosize-textarea'
import { Button } from '@/ui/button'
import { Card } from '@/ui/card'
import { Toggle } from '@/ui/toggle'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/ui/tooltip'
import type { Harker } from 'hark'
import hark from 'hark'
import { Mic, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Message } from './Message'
import { BeatLoader } from 'react-spinners'

const { t, lang } = getUiTranslations()

export interface CommonChatMessage {
  message: string
  isUser: boolean
}

const SpeechRecognition =
  // @ts-expect-error https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#javascript
  window.SpeechRecognition || window.webkitSpeechRecognition

interface Props {
  onSubmit?: (message: string) => Promise<void>
  setMessages: React.Dispatch<React.SetStateAction<CommonChatMessage[]>>
  messages: CommonChatMessage[]
}

export const CommonChat: React.FC<Props> = ({
  onSubmit,
  setMessages,
  messages
}) => {
  const [isTalking, setIsTalking] = useState<boolean>(false)
  const [talkingSubtitle, setTalkingSubtitle] = useState<string>('')
  const [currentMessage, setCurrentMessage] = useState<string>('')
  const [mic, setMic] = useState<MediaStream | null>(null)
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false)
  const recognitionRef = useRef<typeof SpeechRecognition>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const messagesRef = useRef<HTMLUListElement>(null)

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

  const getMic = async () => {
    const mic = await getUserMicrophone()

    if (!mic) {
      toast.error(t('chat.error.speechRecognition'))
      return
    }

    setMic(mic)
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

  const handleSendMessage = async (message: string = currentMessage) => {
    if (message.trim() === '') {
      toast.error(t('chat.error.emptyMessage'))
      return
    }

    messagesRef.current?.scrollTo({
      behavior: 'smooth',
      top: messagesRef.current?.scrollHeight
    })
    setIsGeneratingQuestion(true)
    setMessages((prev) => [...prev, { message, isUser: true }])

    recognitionRef.current?.stop()
    setCurrentMessage('')
    setTalkingSubtitle('')

    await onSubmit?.(message)

    messagesRef.current?.scrollTo({
      behavior: 'smooth',
      top: messagesRef.current?.scrollHeight
    })

    setIsGeneratingQuestion(false)
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

    recognition.lang = LANG_CODES[lang]
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

  return (
    <div className="mt-8">
      <ul
        className="h-[500px] w-full overflow-y-auto flex flex-col gap-3"
        ref={messagesRef}>
        {messages.map((message, index) => (
          <Message
            key={index}
            message={message.message}
            isUser={message.isUser}
          />
        ))}
      </ul>
      <form
        ref={formRef}
        className="flex flex-col items-center relative mt-4"
        onSubmit={async (ev) => {
          ev.preventDefault()
          await handleSendMessage()
        }}>
        {isGeneratingQuestion && (
          <Card className="absolute -top-14 px-4 py-2">
            <BeatLoader size={10} color="#fff" />
          </Card>
        )}
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
    </div>
  )
}
