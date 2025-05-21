import {
  DEFAULT_ATTEMPTS,
  DEFAULT_DOUMENTS,
  DEFAULT_HARD_SKILLS_QUESTIONS,
  DEFAULT_MAX_SUBMISSIONS,
  DEFAULT_NUMBER_OF_ATTEMPT_QUESTIONS,
  DEFAULT_SECONDS_PER_QUESTION,
  DEFAULT_SOFT_SKILLS_QUESTIONS,
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
  DialogTitle
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
import {
  CustomQuestionsInput,
  type CustomQuestion
} from './CustomQuestionsInput'
import { CategoryCreationInput, type Category } from './CategoryCreationInput'
import { DocumentSelector } from './DocumentSelector'
import { useEffect, useState } from 'react'
import type { Document, Survey, SurveyCategory, SurveyDocument } from '@/types'
import { toast } from 'sonner'
import { useDashboardStore } from '@/store/dashboard'
import { getUiTranslations } from '@/i18n/utils'
import { useUiStore } from '@/store/ui'
import type { LANGS } from '@/i18n/ui'

const { t, lang } = getUiTranslations()

const formSchema = z.object({
  title: z.string().min(1, { message: '' }),
  description: z.string().optional(),
  lang: z.enum(INTERVIEW_LANGUAGES),
  offerTitle: z.string().min(1, { message: '' }),
  offerStyle: z.string().min(1, { message: '' }),
  offerDescription: z.string().optional(),
  offerAdditionalInfo: z.string().optional(),
  numberOfHardSkillsQuestions: z.number().min(1, { message: '' }),
  numberOfSoftSkillsQuestions: z.number().min(1, { message: '' }),
  maxAttempts: z.number().min(0, { message: '' }),
  maxSubmissions: z.number().min(1, { message: '' }),
  numberOfAttemptQuestions: z.number().min(1, { message: '' }),
  secondsPerQuestion: z.number().min(1, { message: '' })
})

interface Props {
  isOpen?: boolean
  editingSurvey?: Survey
}

export function CreateSurveyDialog({ editingSurvey, isOpen = false }: Props) {
  const isEditing = Boolean(editingSurvey)

  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>(
    editingSurvey?.customQuestions.map((question) => ({
      id: crypto.randomUUID(),
      question
    })) ?? []
  )
  const [categories, setCategories] = useState<Category[]>(
    editingSurvey?.categories.map((category) => ({
      id: crypto.randomUUID(),
      ...category
    })) ?? []
  )
  const [documents, setDocuments] = useState<Document[]>(
    editingSurvey?.documents.map((document) => ({
      id: crypto.randomUUID(),
      ...document
    })) ?? DEFAULT_DOUMENTS[lang]
  )
  const [dialogState, setDialogState] = useState<boolean>(isOpen)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: editingSurvey?.title ?? '',
      description: editingSurvey?.description ?? '',
      lang: (editingSurvey?.lang ?? lang) as LANGS,
      offerStyle: editingSurvey?.offerStyle ?? '',
      offerTitle: editingSurvey?.offerTitle ?? '',
      offerDescription: editingSurvey?.offerDescription ?? '',
      offerAdditionalInfo: editingSurvey?.offerAdditionalInfo ?? '',
      numberOfHardSkillsQuestions:
        editingSurvey?.numberOfHardSkillsQuestions ??
        DEFAULT_HARD_SKILLS_QUESTIONS,
      numberOfSoftSkillsQuestions:
        editingSurvey?.numberOfSoftSkillsQuestions ??
        DEFAULT_SOFT_SKILLS_QUESTIONS,
      maxAttempts: editingSurvey?.maxAttempts ?? DEFAULT_ATTEMPTS,
      maxSubmissions: editingSurvey?.maxSubmissions ?? DEFAULT_MAX_SUBMISSIONS,
      numberOfAttemptQuestions:
        editingSurvey?.numberOfAttemptQuestions ??
        DEFAULT_NUMBER_OF_ATTEMPT_QUESTIONS,
      secondsPerQuestion:
        editingSurvey?.secondsPerQuestion ?? DEFAULT_SECONDS_PER_QUESTION
    }
  })

  const editingSurveyId = useUiStore((state) => state.editingSurveyId)
  const addSurvey = useDashboardStore((state) => state.addSurvey)
  const setIsCreatingSurvey = useUiStore((state) => state.setIsCreatingSurvey)
  const setEditingSurveyId = useUiStore((state) => state.setEditingSurveyId)
  const updateSurvey = useDashboardStore((state) => state.updateSurvey)

  const createToastMessage = isEditing
    ? t('updatedSurvey.success')
    : t('createSurvey.success')
  const errorToastMessage = isEditing
    ? t('updatedSurvey.error')
    : t('createSurvey.error')

  const resetForm = () => {
    form.reset()
    setCustomQuestions([])
    setCategories([])
    setDocuments([])
    setEditingSurveyId(null)
    setIsCreatingSurvey(false)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let resp

      const requestBody = JSON.stringify({
        ...values,
        categories: categories.map(({ name, description }) => ({
          name,
          description
        })),
        documents: documents.map(
          ({ name, description, isActive, isOptional }) => ({
            name,
            description,
            isActive,
            isOptional
          })
        ),
        customQuestions: customQuestions.map(({ question }) => question)
      })

      if (isEditing) {
        resp = await fetch(`/api/survey/${editingSurveyId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: requestBody
        })
      } else {
        resp = await fetch('/api/survey', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: requestBody
        })
      }

      const body = await resp.json()

      if (body.survey) {
        if (isEditing) {
          updateSurvey(editingSurveyId!, {
            ...body.survey,
            documents: body.survey.surveysToSurveysDocuments.map(
              ({ document }: { document: SurveyDocument }) => document
            ),
            categories: body.survey.surveysToSurveyCategories.map(
              ({ category }: { category: SurveyCategory }) => category
            )
          })
        } else {
          addSurvey(body.survey)
        }

        toast.success(createToastMessage)
        resetForm()
      } else {
        toast.error(errorToastMessage)
      }
      form.reset()
    } catch (error) {
      console.log(error)
      toast.error(errorToastMessage)
    }
  }

  const onCloseDialog = (open: boolean) => {
    if (!open) {
      resetForm()
    }

    setDialogState(open)
  }

  const totalOfQuestions =
    form.getValues('numberOfHardSkillsQuestions') +
    form.getValues('numberOfSoftSkillsQuestions')

  useEffect(() => {
    setDialogState(isOpen)
  }, [isOpen])

  return (
    <Dialog onOpenChange={onCloseDialog} open={dialogState}>
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
                    name="lang"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('dashboard.createSurvey.general.language')}
                        </FormLabel>
                        <FormControl>
                          <Select required defaultValue={lang}>
                            <SelectTrigger
                              className="w-full capitalize"
                              {...field}>
                              <SelectValue
                                placeholder={t(
                                  'dashboard.createSurvey.general.language.placeholder'
                                )}
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
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t('dashboard.createSurvey.offer.style.description')}
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
                          {t('dashboard.createSurvey.offer.title.description')}
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
                            className="text-lg"
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
                    name="offerAdditionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t(
                            'dashboard.createSurvey.offer.additionalInformation'
                          )}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="..."
                            className="text-lg"
                            {...field}
                          />
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
                      <FormField
                        control={form.control}
                        name="numberOfSoftSkillsQuestions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t(
                                'dashboard.createSurvey.questions.softSkills.description'
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="3"
                                className="text-lg"
                                min={0}
                                max={MAX_NUMBER_OF_QUESTIONS}
                                type="number"
                                onChange={(event) =>
                                  field.onChange(+event.target.value)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </li>
                    <li>
                      <h3 className="text-lg">
                        {t('dashboard.createSurvey.questions.hardSkills')}
                      </h3>
                      <FormField
                        control={form.control}
                        name="numberOfHardSkillsQuestions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t(
                                'dashboard.createSurvey.questions.hardSkills.description'
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="3"
                                className="text-lg"
                                min={0}
                                max={MAX_NUMBER_OF_QUESTIONS}
                                type="number"
                                onChange={(event) =>
                                  field.onChange(+event.target.value)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </li>
                    <li>
                      <CustomQuestionsInput
                        max={totalOfQuestions}
                        onChange={setCustomQuestions}
                        questions={customQuestions}
                      />
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
                  <CategoryCreationInput
                    onChange={setCategories}
                    categories={categories}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="documents">
                <AccordionTrigger>
                  {t('dashboard.createSurvey.documents')}
                </AccordionTrigger>
                <AccordionContent className="space-y-6">
                  <p>{t('dashboard.createSurvey.documents.description')}</p>
                  <DocumentSelector
                    onChange={setDocuments}
                    documents={documents}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="additional-config">
                <AccordionTrigger>
                  {t('dashboard.createSurvey.additionalConfig')}
                </AccordionTrigger>
                <AccordionContent className="space-y-6">
                  <p>
                    {t('dashboard.createSurvey.additionalConfig.description')}
                  </p>
                  <ul className="flex flex-col gap-4 [&>li]:flex [&>li]:gap-2 [&>li>h3]:text-lg [&>li]:flex-col">
                    <li>
                      <h3 className="text-lg">
                        {t(
                          'dashboard.createSurvey.additionalConfig.numberOfAttempts'
                        )}
                      </h3>
                      <FormField
                        control={form.control}
                        name="maxAttempts"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t(
                                'dashboard.createSurvey.additionalConfig.numberOfAttempts.description'
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="3"
                                className="text-lg"
                                min={0}
                                type="number"
                                onChange={(event) =>
                                  field.onChange(+event.target.value)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </li>
                    <li>
                      <h3 className="text-lg">
                        {t(
                          'dashboard.createSurvey.additionalConfig.numberOfSubmissions'
                        )}
                      </h3>
                      <FormField
                        control={form.control}
                        name="maxSubmissions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t(
                                'dashboard.createSurvey.additionalConfig.numberOfSubmissions.description'
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="1"
                                className="text-lg"
                                min={1}
                                type="number"
                                onChange={(event) =>
                                  field.onChange(+event.target.value)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </li>
                    <li>
                      <h3 className="text-lg">
                        {t(
                          'dashboard.createSurvey.additionalConfig.numberOfAttemptQuestions'
                        )}
                      </h3>
                      <FormField
                        control={form.control}
                        name="numberOfAttemptQuestions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t(
                                'dashboard.createSurvey.additionalConfig.numberOfAttemptQuestions.description'
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="1"
                                className="text-lg"
                                min={1}
                                type="number"
                                onChange={(event) =>
                                  field.onChange(+event.target.value)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </li>
                    <li>
                      <h3 className="text-lg">
                        {t(
                          'dashboard.createSurvey.additionalConfig.secondsPerQuestion'
                        )}
                      </h3>
                      <FormField
                        control={form.control}
                        name="secondsPerQuestion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t(
                                'dashboard.createSurvey.additionalConfig.secondsPerQuestion.description'
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="1"
                                className="text-lg"
                                min={1}
                                type="number"
                                onChange={(event) =>
                                  field.onChange(+event.target.value)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Button type="submit" className="w-full">
              {isEditing
                ? t('dashboard.editSurvey.save')
                : t('dashboard.createSurvey.create')}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
