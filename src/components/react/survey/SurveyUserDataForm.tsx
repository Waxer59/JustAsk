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
import { getUiTranslations } from '@/i18n/utils'
import { Checkbox } from '@/ui/checkbox'
import { toast } from 'sonner'
import { getRelativeLocaleUrl } from 'astro:i18n'

const { t } = getUiTranslations()

export const SurveyUserDataForm = () => {
  const email = useSurveyStore((state) => state.email)
  const name = useSurveyStore((state) => state.name)
  const consent = useSurveyStore((state) => state.consent)
  const form = useForm<z.infer<typeof surveyUserDataSchema>>({
    resolver: zodResolver(surveyUserDataSchema),
    defaultValues: {
      name,
      email,
      consent
    }
  })
  const lang = useSurveyStore((state) => state.lang)
  const setName = useSurveyStore((state) => state.setName)
  const setEmail = useSurveyStore((state) => state.setEmail)
  const setConsent = useSurveyStore((state) => state.setConsent)
  const nextStep = useSurveyStore((state) => state.nextStep)

  const onSubmit = (values: z.infer<typeof surveyUserDataSchema>) => {
    if (!values.consent) {
      toast.error(t('survey.userData.consentRequired', lang))
      return
    }

    setName(values.name)
    setConsent(values.consent)
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
              <FormLabel>{t('survey.userData.name', lang)}</FormLabel>
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
              <FormLabel>{t('survey.userData.email', lang)}</FormLabel>
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
        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox
                  id="consent"
                  defaultChecked={field.value}
                  className="text-lg"
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel
                htmlFor="consent"
                className="text-md !mt-0 underline cursor-pointer">
                <a
                  href={getRelativeLocaleUrl(lang, '/privacy-policy')}
                  target="_blank">
                  {t('survey.userData.consent', lang)}
                </a>
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mx-auto">
          {t('survey.userData.continue', lang)}
        </Button>
      </form>
    </Form>
  )
}
