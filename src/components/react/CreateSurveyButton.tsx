import { Button } from '@/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/ui/dialog'

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
        </DialogContent>
      </Dialog>
    </>
  )
}
