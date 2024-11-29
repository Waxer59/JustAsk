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

const formSchema = z.object({
  title: z.string().min(1, { message: '' }),
  description: z.string().optional(),
  language: z.enum(INTERVIEW_LANGUAGES),
  offerTitle: z.string().min(1, { message: '' }),
  offerStyle: z.string(),
  offerDescription: z.string().optional(),
  offerAditionalInformation: z.string().optional(),
  numberOfHardQuestions: z.number().min(1, { message: '' }),
  numberOfSoftQuestions: z.number().min(1, { message: '' }),
  numberOfOtherQuestions: z.number().min(1, { message: '' })
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
          <Button>Create survey</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[650px] overflow-auto">
          <DialogHeader>
            <DialogTitle>Create survey</DialogTitle>
            <DialogDescription>
              Create a survey to get instant feedback from your customers.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Accordion type="single" collapsible defaultValue="general">
                <AccordionItem value="general">
                  <AccordionTrigger>General</AccordionTrigger>
                  <AccordionContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Students survey"
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
                          <FormLabel>Language</FormLabel>
                          <FormControl>
                            <Select {...field} required>
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder="Select a language"
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
                            Select the language of the interview
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
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="This survey is for students"
                              className="text-lg"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Optional</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="offer">
                  <AccordionTrigger>Offer</AccordionTrigger>
                  <AccordionContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="offerStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Style</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Technical"
                              className="text-lg"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            What person is interviewing?
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
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Frontend developer"
                              className="text-lg"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide a title for your offer
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
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Frontend developer with 10 years of experience in react"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Describe the offer in detail
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
                          <FormLabel>Aditional Information</FormLabel>
                          <FormControl>
                            <Textarea placeholder="..." required {...field} />
                          </FormControl>
                          <FormDescription>
                            Specify any additional information
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="questions">
                  <AccordionTrigger>Questions</AccordionTrigger>
                  <AccordionContent className="space-y-6">
                    <ul className="flex flex-col gap-4 [&>li]:flex [&>li]:gap-2 [&>li>h3]:text-lg [&>li]:flex-col">
                      <li>
                        <h3 className="text-lg">Soft skills</h3>
                        <div className="flex flex-col gap-4">
                          <FormField
                            control={form.control}
                            name="numberOfSoftQuestions"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Number of soft skills questions
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
                          <FormField
                            control={form.control}
                            name="numberOfSoftQuestions"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Custom questions</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="..."
                                    className="text-lg"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Specify which questions should be included in
                                  the survey survey
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </li>
                      <li>
                        <h3 className="text-lg">Hard skills</h3>
                        <FormField
                          control={form.control}
                          name="numberOfHardQuestions"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Number of hard skills questions
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
                      </li>
                      <li>
                        <h3 className="text-lg">Other</h3>
                        <FormField
                          control={form.control}
                          name="numberOfOtherQuestions"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of other questions</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="0"
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
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="categorization">
                  <AccordionTrigger>Categorization</AccordionTrigger>
                  <AccordionContent className="space-y-6">
                    <p>
                      Add categories to know what level your candidates are at.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="documents">
                  <AccordionTrigger>Documents</AccordionTrigger>
                  <AccordionContent className="space-y-6">
                    <p>
                      Specify the documents that will be used to evaluate the
                      candidates.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Button type="submit" className="w-full">
                Create
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
