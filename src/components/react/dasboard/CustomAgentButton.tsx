import { getUiTranslations } from '@/i18n/utils'
import { useAgentsStore } from '@/store/agents'
import { Button } from '@/ui/button'
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from '@/ui/dialog'
import { FormControl, FormField, FormItem, FormLabel } from '@/ui/form'
import { Input } from '@/ui/input'
import { Textarea } from '@/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const { t, lang } = getUiTranslations()

const Form = FormProvider

const formSchema = z.object({
  agent_name: z.string().min(1, { message: '' }),
  agent_description: z.string().optional(),
  agent_action: z.string().min(1, { message: '' })
})

export const CustomAgentButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const setAgents = useAgentsStore((state) => state.setAgents)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agent_name: '',
      agent_description: '',
      agent_action: ''
    }
  })

  const updateAgents = async () => {
    try {
      const agentsResp = await fetch(`/api/dashboard/rag/agents?lang=${lang}`)
      const data = await agentsResp.json()
      setAgents(data)
    } catch {
      toast.error(t('dashboard.agentsResponse.error'))
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsOpen(false)
    toast.promise(
      fetch('/api/dashboard/rag/agents/custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      }),
      {
        loading: t('dashboard.customAgent.loading'),
        success: async () => {
          await updateAgents()
          return t('dashboard.customAgent.success')
        },
        error: t('dashboard.customAgent.error')
      }
    )
  }

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button>{t('dashboard.customAgent.create')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('dashboard.customAgent.create')}</DialogTitle>
          <DialogDescription>
            {t('dashboard.customAgent.dialog.description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="agent_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('dashboard.customAgent.name')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Terminator"
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
                      placeholder="..."
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
                  <FormLabel>{t('dashboard.customAgent.action')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="..."
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
  )
}
