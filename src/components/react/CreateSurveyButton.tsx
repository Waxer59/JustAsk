import { Button } from '@/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/ui/dialog'
import { Form, FormField } from '@/ui/form'

export function CreateSurveyButton() {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Create survey</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create survey</DialogTitle>
            <DialogDescription>
              Create a survey to get instant feedback from your customers.
            </DialogDescription>
          </DialogHeader>
          <Form>
            <FormField label="Title" name="title" type="text" />
            <FormField label="Description" name="description" type="text" />
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
