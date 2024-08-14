import { RadioGroup, RadioGroupItem } from '@ui/radio-group'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@ui/button'
import { Input } from '@ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Textarea } from '@/ui/textarea'
import { useInterviewStore } from '@/store/interview'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import type { CreateQuestionsData, CreateQuestionsResponse } from '@/types'
import { BounceLoader } from 'react-spinners'
import { useUiStore } from '@/store/ui'

const formSchema = z.object({
  type: z.enum(['interview', 'questions'], {
    required_error: 'Tienes que seleccionar el tipo de simulacion'
  }),
  interviewStyle: z.string(),
  additionalInfo: z.string().optional()
})
export const ConfigureStep = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'interview',
      interviewStyle: '',
      additionalInfo: ''
    }
  })
  const currentOffer = useInterviewStore((state) => state.currentOffer)
  const documents = useInterviewStore((state) => state.documents)
  const setIsSimulatingInterview = useInterviewStore(
    (state) => state.setIsSimulatingInterview
  )
  const nextStep = useInterviewStore((state) => state.nextStep)
  const setQuestions = useInterviewStore((state) => state.setQuestions)
  const setDisableControlButtons = useUiStore(
    (state) => state.setDisableControlButtons
  )
  const [sendData, setSendData] = useState<CreateQuestionsData | null>(null)
  const { isLoading, refetch, data } = useQuery<CreateQuestionsResponse>({
    queryKey: ['questions', sendData],
    enabled: false,
    retry: false,
    queryFn: ({ queryKey }) => {
      const [, data] = queryKey
      return fetch('/api/createQuestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then((res) => res.json())
    }
  })

  useEffect(() => {
    if (data) {
      setQuestions(data.questions)
      nextStep()
    }
  }, [data])

  useEffect(() => {
    if (!sendData) {
      return
    }

    setDisableControlButtons(true)
    refetch()
  }, [sendData])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { interviewStyle, additionalInfo, type } = values

    if (type === 'interview') {
      setIsSimulatingInterview(true)
    }

    setSendData({
      offer: currentOffer!,
      interviewStyle,
      additionalInfo,
      documents
    })
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="w-full flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="interviewStyle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estilo de la entrevista</FormLabel>
                <FormControl>
                  <Input placeholder="Tecnica" {...field} className="text-lg" />
                </FormControl>
                <FormDescription>
                  ¿Que estilo de entrevista quieres?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Define la simulacion</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1">
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="questions" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Solo quiero las preguntas
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="interview" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        ¡Simulemos una entrevista!
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="additionalInfo"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>¿Quieres añadir algo más?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="..."
                    className="min-h-36 text-lg"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Informacion adicional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            ¡Empezar!
          </Button>
        </form>
      </Form>
    </div>
  )
}

const Loading = () => {
  return (
    <div className="flex flex-col gap-8 justify-center items-center">
      <BounceLoader color="#2f2f33" />
      <p className="text-xl">Estamos pensado las preguntas</p>
    </div>
  )
}
