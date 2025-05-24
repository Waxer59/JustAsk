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

interface Props {
  id: string
  title: string
  description: string
}

export const AgentCard: React.FC<Props> = ({ title, description }) => {
  const [messages, setMessages] = useState<CommonChatMessage[]>([])

  const handleSubmit = async () => {}

  return (
    <Card className="p-4 flex flex-col gap-4 justify-between h-full w-full">
      <Dialog>
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
                setMessages={setMessages}
                messages={messages}
                onSubmit={handleSubmit}
              />
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
