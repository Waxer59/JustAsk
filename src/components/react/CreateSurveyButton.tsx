import {
  INTERVIEW_LANGUAGES,
  LANGUAGE_TEXT,
  MAX_NUMBER_OF_QUESTIONS
} from '@/constants'
import { Button } from '@/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@ui/accordion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/ui/form'
import { Input } from '@/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Textarea } from '@/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@ui/select'
import { CustomQuestionsInput } from './CustomQuestionsInput'
import { CategoryCreationInput } from './CategoryCreationInput'
import { DocumentSelector } from './DocumentSelector'
import { getLangFromUrl, useTranslations } from '@/i18n/utils'

const url = new URL(window.location.href)
const lang = getLangFromUrl(url)
const t = useTranslations(lang)

const formSchema = z.object({
  title: z.string().min(1, { message: '' }),
  description: z.string().optional(),
  language: z.enum(INTERVIEW_LANGUAGES),
  offerTitle: z.string().min(1, { message: '' }),
  offerStyle: z.string(),
  offerDescription: z.string().optional(),
  offerAditionalInformation: z.string().optional(),
  numberOfHardQuestions: z.number().min(1, { message: '' }),
  numberOfSoftQuestions: z.number().min(1, { message: '' })
})

export function CreateSurveyButton() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>{t('dashboard.createSurvey')}</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[650px] overflow-auto">
          <DialogHeader>
            <DialogTitle>{t('dashboard.createSurvey')}</DialogTitle>
            <DialogDescription>
              {t('dashboard.createSurvey.description')}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Accordion type="single" collapsible defaultValue="general">
                <AccordionItem value="general">
                  <AccordionTrigger>
                    {t('dashboard.createSurvey.general')}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t('dashboard.createSurvey.general.title')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t(
                                'dashboard.createSurvey.general.title.placeholder'
                              )}
                              className="text-lg"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t('dashboard.createSurvey.general.language')}
                          </FormLabel>
                          <FormControl>
                            <Select required>
                              <SelectTrigger
                                className="w-full capitalize"
                                {...field}>
                                <SelectValue
                                  placeholder={t(
                                    'dashboard.createSurvey.general.language.placeholder'
                                  )}
                                  defaultValue={INTERVIEW_LANGUAGES[0]}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.keys(LANGUAGE_TEXT).map((key) => (
                                  <SelectItem
                                    key={key}
                                    value={key}
                                    className="capitalize">
                                    {
                                      LANGUAGE_TEXT[
                                        key as keyof typeof LANGUAGE_TEXT
                                      ]
                                    }
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>
                            {t(
                              'dashboard.createSurvey.general.language.description'
                            )}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t('dashboard.createSurvey.general.description')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t(
                                'dashboard.createSurvey.general.description.placeholder'
                              )}
                              className="text-lg"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {t(
                              'dashboard.createSurvey.general.description.description'
                            )}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="offer">
                  <AccordionTrigger>
                    {t('dashboard.createSurvey.offer')}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="offerStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t('dashboard.createSurvey.offer.style')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t(
                                'dashboard.createSurvey.offer.style.placeholder'
                              )}
                              className="text-lg"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {t(
                              'dashboard.createSurvey.offer.style.description'
                            )}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="offerTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t('dashboard.createSurvey.offer.title')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t(
                                'dashboard.createSurvey.offer.title.placeholder'
                              )}
                              className="text-lg"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {t(
                              'dashboard.createSurvey.offer.title.description'
                            )}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="offerDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t('dashboard.createSurvey.offer.description')}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t(
                                'dashboard.createSurvey.offer.description.placeholder'
                              )}
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {t(
                              'dashboard.createSurvey.offer.description.description'
                            )}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="offerAditionalInformation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t(
                              'dashboard.createSurvey.offer.additionalInformation'
                            )}
                          </FormLabel>
                          <FormControl>
                            <Textarea placeholder="..." required {...field} />
                          </FormControl>
                          <FormDescription>
                            {t(
                              'dashboard.createSurvey.offer.additionalInformation.description'
                            )}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="questions">
                  <AccordionTrigger>
                    {t('dashboard.createSurvey.questions')}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-6">
                    <p>{t('dashboard.createSurvey.questions.description')}</p>
                    <ul className="flex flex-col gap-4 [&>li]:flex [&>li]:gap-2 [&>li>h3]:text-lg [&>li]:flex-col">
                      <li>
                        <h3 className="text-lg">
                          {t('dashboard.createSurvey.questions.softSkills')}
                        </h3>
                        <div className="flex flex-col gap-2">
                          <FormField
                            control={form.control}
                            name="numberOfSoftQuestions"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t(
                                    'dashboard.createSurvey.questions.softSkills.description'
                                  )}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="3"
                                    className="text-lg"
                                    min={0}
                                    max={MAX_NUMBER_OF_QUESTIONS}
                                    type="number"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </li>
                      <li>
                        <div className="flex flex-col gap-2">
                          <h3 className="text-lg">
                            {t('dashboard.createSurvey.questions.hardSkills')}
                          </h3>
                          <FormField
                            control={form.control}
                            name="numberOfHardQuestions"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t(
                                    'dashboard.createSurvey.questions.hardSkills.description'
                                  )}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="3"
                                    className="text-lg"
                                    min={0}
                                    max={MAX_NUMBER_OF_QUESTIONS}
                                    type="number"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </li>
                      <li>
                        <CustomQuestionsInput max={2} />
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="categorization">
                  <AccordionTrigger>
                    {t('dashboard.createSurvey.categorization')}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-6">
                    <p>
                      {t('dashboard.createSurvey.categorization.description')}
                    </p>
                    <CategoryCreationInput />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="documents">
                  <AccordionTrigger>
                    {t('dashboard.createSurvey.documents')}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-6">
                    <p>{t('dashboard.createSurvey.documents.description')}</p>
                    <DocumentSelector />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Button type="submit" className="w-full">
                {t('dashboard.createSurvey.create')}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
