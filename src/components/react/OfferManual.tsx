import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@ui/form'
import { Input } from '@ui/input'
import { Textarea } from '@ui/textarea'
import { Button } from '@ui/button'
import { useInterviewStore } from '@store/interview'

const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }), // TODO: Change msg
  description: z.string().min(1, { message: 'Description is required' }) // TODO: Change msg
})

export const OfferManual = () => {
  const isCurrentOfferManual = useInterviewStore(
    (state) => state.isCurrentOfferManual
  )
  const currentOffer = useInterviewStore((state) => state.currentOffer)
  const setIsCurrentOfferManual = useInterviewStore(
    (state) => state.setIsCurrentOfferManual
  )
  const setCurrentOffer = useInterviewStore((state) => state.setCurrentOffer)
  const nextStep = useInterviewStore((state) => state.nextStep)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: isCurrentOfferManual ? currentOffer?.title : '',
      description: isCurrentOfferManual ? currentOffer?.description : ''
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { title, description } = values

    setCurrentOffer({
      title,
      description
    })
    setIsCurrentOfferManual(true)
    nextStep()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Frontend developer"
                  className="text-lg"
                  {...field}
                />
              </FormControl>
              <FormDescription>The job offer title</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="..."
                  className="min-h-36 text-lg"
                  {...field}
                />
              </FormControl>
              <FormDescription>The job offer description</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Seleccionar oferta</Button>
      </form>
    </Form>
  )
}