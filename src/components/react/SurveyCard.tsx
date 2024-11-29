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
  CopyIcon,
  EllipsisIcon,
  PencilIcon,
  ShareIcon,
  TrashIcon,
  UserIcon
} from 'lucide-react'
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@ui/tooltip'
import { toast } from 'sonner'

interface Props {
  title: string
  url: string
  description?: string
  numberOfResponses: number
}

export const SurveyCard = ({
  title,
  url,
  description,
  numberOfResponses
}: Props) => {
  const handleClickCopy = () => {
    navigator.clipboard.writeText(url)
    toast.success('Copied to clipboard!')
  }

  return (
    <Card className="p-4 flex flex-col gap-4 justify-between h-full w-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-1 w-full">
            <div className="flex w-full justify-between items-center">
              <h2
                className="text-2xl font-bold truncate hover:underline"
                title={title}>
                <a href="/dashboard/a">{title}</a>
              </h2>
              <TooltipProvider>
                <Tooltip>
                  <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <EllipsisIcon />
                          </Button>
                        </TooltipTrigger>
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
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the survey.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <TooltipContent>
                    <p>Options</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex w-full gap-2 items-center justify-between">
              <a
                href={url}
                className="underline"
                target="_blank"
                rel="noreferrer">
                {url}
              </a>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={handleClickCopy}>
                      <CopyIcon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy link</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {description && (
            <p className="italic text-pretty text-gray-300 text-ellipsis">
              {description}
            </p>
          )}
          <div className="flex items-center gap-2">
            <UserIcon />
            <span>{numberOfResponses}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
