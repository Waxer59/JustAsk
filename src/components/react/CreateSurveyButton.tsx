import { INTERVIEW_LANGUAGES } from '@/constants'
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
              <Accordion type="single" collapsible>
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
                    <h3 className="text-lg">Soft skills</h3>
                    <FormField
                      control={form.control}
                      name="numberOfSoftQuestions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of soft skills questions</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="3"
                              className="text-lg"
                              min={1}
                              type="number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <h3 className="text-lg">Hard skills</h3>
                    <FormField
                      control={form.control}
                      name="numberOfHardQuestions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of hard skills questions</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="3"
                              className="text-lg"
                              min={1}
                              type="number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <h3 className="text-lg">Other</h3>
                    <FormField
                      control={form.control}
                      name="numberOfOtherQuestions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of other questions</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="1"
                              className="text-lg"
                              min={1}
                              type="number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="categorization">
                  <AccordionTrigger>Categorization</AccordionTrigger>
                  <AccordionContent className="space-y-6"></AccordionContent>
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
