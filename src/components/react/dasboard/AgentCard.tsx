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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel
} from '@ui/dropdown-menu'
import { EllipsisIcon } from 'lucide-react'
import { useAgentsStore } from '@/store/agents'
import { FormControl, FormField, FormItem, FormLabel } from '@/ui/form'
import { Input } from '@/ui/input'
import { Textarea } from '@/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

interface Props {
  id: string
  title: string
  description: string
  action?: string
  isCustom: boolean
}

const { t } = getUiTranslations()

const Form = FormProvider

const formSchema = z.object({
  agent_name: z.string().min(1, { message: '' }),
  agent_description: z.string().optional(),
  agent_action: z.string().min(1, { message: '' })
})

export const AgentCard: React.FC<Props> = ({
  id,
  title,
  description,
  action,
  isCustom
}) => {
  const [messages, setMessages] = useState<CommonChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false)
  const [isEdittingAgent, setIsEdittingAgent] = useState(false)
  const removeAgent = useAgentsStore((state) => state.removeAgent)
  const updateAgent = useAgentsStore((state) => state.updateAgent)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agent_name: title,
      agent_description: description,
      agent_action: action ?? ''
    }
  })

  const handleSubmit = async (message: string) => {
    await generateQuestion(isCustom ? message : undefined)
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

  const generateQuestion = async (message?: string) => {
    setIsLoading(true)
    try {
      const resp = await fetch(`/api/dashboard/rag/agents/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message ?? ''
        })
      })
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
      await generateQuestion(t('dashboard.agents.custom.opening'))
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

  const handleDeleteAgent = async () => {
    try {
      await fetch(`/api/dashboard/rag/agents/custom/${id}`, {
        method: 'DELETE'
      })
      toast.success(t('dahboard.agents.delete.success'))
      removeAgent(id)
    } catch (error) {
      console.log(error)
      toast.error(t('dashboard.options.delete.error'))
    }
  }

  const handleEditAgent = (values: z.infer<typeof formSchema>) => {
    setIsEdittingAgent(false)
    toast.promise(
      fetch(`/api/dashboard/rag/agents/custom/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      }),
      {
        loading: t('dashboard.agents.custom.editing'),
        success: async () => {
          updateAgent(id, {
            id: id,
            name: values.agent_name,
            description: values.agent_description,
            action: values.agent_action,
            isCustom: true
          })
          return t('dashboard.agents.custom.edit.success')
        },
        error: t('dashboard.agents.custom.edit.error')
      }
    )
  }

  return (
    <Card
      className="p-4 flex flex-col gap-4 justify-between h-full w-full"
      key={id}>
      <Dialog onOpenChange={handleOnOpenChange}>
        <div className="flex justify-between">
          <DialogTrigger>
            <h2
              className="text-2xl font-bold truncate cursor-pointer hover:underline text-start"
              title={title}>
              {title}
            </h2>
          </DialogTrigger>
          {isCustom && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <EllipsisIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Dialog
                  onOpenChange={setIsEdittingAgent}
                  open={isEdittingAgent}>
                  <DialogTrigger asChild>
                    <DropdownMenuLabel className="cursor-pointer">
                      {t('dashboard.options.edit')}
                    </DropdownMenuLabel>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {t('dashboard.agents.custom.edit')}
                      </DialogTitle>
                      <DialogDescription>
                        {t('dashboard.agents.custom.edit.description')}
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(handleEditAgent)}
                        className="space-y-6">
                        <FormField
                          control={form.control}
                          name="agent_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t('dashboard.customAgent.name')}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={title}
                                  className="text-lg"
                                  required
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="agent_description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t('dashboard.customAgent.description')}
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder={description}
                                  className="text-lg"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="agent_action"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t('dashboard.customAgent.action')}
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder={action ?? ''}
                                  className="text-lg"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full">
                          {t('dashboard.customAgent.create')}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                <DropdownMenuLabel
                  className="text-red-500 cursor-pointer"
                  onClick={handleDeleteAgent}>
                  {t('dashboard.options.delete')}
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
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
              {!isCustom && (
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
              )}
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
