import { z } from 'zod'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/ui/form'
import { Input } from '@/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/ui/button'
import { useSurveyStore } from '@/store/survey'
import { surveyUserDataSchema } from '@/lib/validationSchemas/survey-user-data'

export const SurveyUserDataForm = () => {
  const email = useSurveyStore((state) => state.email)
  const name = useSurveyStore((state) => state.name)
  const form = useForm<z.infer<typeof surveyUserDataSchema>>({
    resolver: zodResolver(surveyUserDataSchema),
    defaultValues: {
      name,
      email
    }
  })
  const setName = useSurveyStore((state) => state.setName)
  const setEmail = useSurveyStore((state) => state.setEmail)
  const nextStep = useSurveyStore((state) => state.nextStep)

  const onSubmit = (values: z.infer<typeof surveyUserDataSchema>) => {
    setName(values.name)
    setEmail(values.email)
    nextStep()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="name"
                  className="text-lg w-full"
                  placeholder="John Doe"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="john@example.com"
                  autoCapitalize="email"
                  className="text-lg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mx-auto">
          Continuar
        </Button>
      </form>
    </Form>
  )
}
