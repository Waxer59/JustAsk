import { getUiTranslations } from '@/i18n/utils'
import { useSurveyStore } from '@/store/survey'
import { Button } from '@/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@ui/dialog'
import { SmileIcon } from 'lucide-react'

const { t } = getUiTranslations()

interface Props {
  feedback?: string | null
}

export const SurveyCompleted: React.FC<Props> = ({ feedback }) => {
  const lang = useSurveyStore((state) => state.lang)

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <SmileIcon size={92} />
      <p className="text-xl">{t('surveyCompleted.feedback', lang)}</p>
      <Dialog>
        <DialogTrigger asChild>
          <Button>{t('survey.viewFeedback', lang)}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('survey.feedback', lang)}</DialogTitle>
            <p>{feedback}</p>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
