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
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
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
import { Badge } from '@/ui/badge'
import { getUiTranslations } from '@/i18n/utils'
import { useDashboardStore } from '@/store/dashboard'
import { useUiStore } from '@/store/ui'

interface Props {
  id: string
  title: string
  url: string
  lang: string
  description?: string
  numberOfResponses: number
  shareCode?: string | null
}

const { t } = getUiTranslations()

export const SurveyCard = ({
  id,
  title,
  url,
  description,
  numberOfResponses,
  shareCode,
  lang
}: Props) => {
  const removeSurvey = useDashboardStore((state) => state.removeSurvey)
  const updateSurvey = useDashboardStore((state) => state.updateSurvey)
  const setEditingSurveyId = useUiStore((state) => state.setEditingSurveyId)

  const handleDeleteSurvey = async () => {
    try {
      await fetch(`/api/survey/${id}`, {
        method: 'DELETE'
      })

      toast.success(t('dashboard.options.delete.success'))
      removeSurvey(id)
    } catch (error) {
      console.log(error)
      toast.error(t('dashboard.options.delete.error'))
    }
  }

  const handleShareCode = async () => {
    try {
      const resp = await fetch(`/api/survey/share/${id}`, {
        method: 'POST'
      })

      const body = await resp.json()

      updateSurvey(id, body.survey)

      toast.success(t('dashboard.options.share.success'))
    } catch (error) {
      console.log(error)
      toast.error(t('dashboard.options.share.error'))
    }
  }

  const handleDeleteShareCode = async () => {
    try {
      await fetch(`/api/survey/share/${id}`, {
        method: 'DELETE'
      })

      toast.success(t('dashboard.options.share.success'))
      updateSurvey(id, { shareCode: null })
    } catch (error) {
      console.log(error)
      toast.error(t('dashboard.options.share.error'))
    }
  }

  const handleCopyShareCode = async () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/${lang}/survey/share/${shareCode}`
    )
    toast.success(t('dashboard.clipBoard.success'))
  }

  const handleClickCopy = () => {
    navigator.clipboard.writeText(url)
    toast.success(t('dashboard.clipBoard.success'))
  }

  const handleEditSurvey = () => {
    setEditingSurveyId(id)
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
                <a href={`/dashboard/${id}`}>{title}</a>
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
                        <DropdownMenuItem onClick={handleEditSurvey}>
                          <PencilIcon /> {t('dashboard.options.edit')}
                        </DropdownMenuItem>
                        {shareCode ? (
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <ShareIcon /> {t('dashboard.options.share')}
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={handleCopyShareCode}>
                                  <CopyIcon />{' '}
                                  {t('dashboard.options.share.copy')}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-500"
                                  onClick={handleDeleteShareCode}>
                                  <TrashIcon />{' '}
                                  {t('dashboard.options.share.delete')}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        ) : (
                          <DropdownMenuItem onClick={handleShareCode}>
                            <ShareIcon /> {t('dashboard.options.share')}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <AlertDialogTrigger className="text-red-500 flex gap-2 items-center">
                            <TrashIcon /> {t('dashboard.options.delete')}
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
                        <AlertDialogAction onClick={handleDeleteSurvey}>
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
            <Badge variant="secondary" className="uppercase">
              {lang}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  )
}
