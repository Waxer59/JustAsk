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
import { getLangFromUrl, useTranslations } from '@/i18n/utils'
import { Badge } from '@/ui/badge'

interface Props {
  title: string
  url: string
  description?: string
  numberOfResponses: number
}

const url = new URL(window.location.href)
const lang = getLangFromUrl(url)
const t = useTranslations(lang)

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
                            {t('dashboard.options.edit')} <PencilIcon />
                          </button>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <button className="w-full cursor-pointer flex justify-between">
                            {t('dashboard.options.share')} <ShareIcon />
                          </button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <AlertDialogTrigger asChild>
                            <button className="w-full cursor-pointer text-red-500 flex justify-between">
                              {t('dashboard.options.delete')} <TrashIcon />
                            </button>
                          </AlertDialogTrigger>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t('dashboard.options.delete.dialog.title')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('dashboard.options.delete.dialog.description')}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          {t('dashboard.options.delete.dialog.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction>
                          {t('dashboard.options.delete.dialog.confirm')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <TooltipContent>
                    <p>{t('tooltip.options')}</p>
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
                    <p>{t('tooltip.copyLink')}</p>
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
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-2">
              <UserIcon />
              <span>{numberOfResponses}</span>
            </div>
            <Badge variant="secondary">ES</Badge>
          </div>
        </div>
      </div>
    </Card>
  )
}
