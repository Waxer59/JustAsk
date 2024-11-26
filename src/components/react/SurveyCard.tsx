import { Button } from '@ui/button'
import { Card } from '@ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@ui/dropdown-menu'
import {
  EllipsisIcon,
  PencilIcon,
  ShareIcon,
  TrashIcon,
  UserIcon
} from 'lucide-react'

interface Props {
  title: string
  description?: string
  numberOfResponses: number
}

export const SurveyCard = ({
  title,
  description,
  numberOfResponses
}: Props) => {
  return (
    <Card className="p-4 cursor-pointer flex flex-col gap-4 justify-between h-full w-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-2xl font-bold truncate" title={title}>
            {title}
          </h2>
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <EllipsisIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <button className="w-full cursor-pointer flex justify-between">
                    Edit <PencilIcon />
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button className="w-full cursor-pointer flex justify-between">
                    Share <ShareIcon />
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <AlertDialogTrigger asChild>
                    <button className="w-full cursor-pointer text-red-500 flex justify-between">
                      Delete <TrashIcon />
                    </button>
                  </AlertDialogTrigger>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  survey.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        {description && (
          <p className="italic text-pretty text-gray-300 text-ellipsis">
            {description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <UserIcon />
        <span>{numberOfResponses}</span>
      </div>
    </Card>
  )
}
