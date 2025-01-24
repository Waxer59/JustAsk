import { Button } from '@/ui/button'
import { HorizontalLine } from '../common/HorizontalLine'
import { getUiTranslations } from '@/i18n/utils'
import { useSurveyStore } from '@/store/survey'

interface Props {
  numberOfAttempts: number
  numberOfSubmissions: number
  onAttemptClick: () => void
  onSubmissionClick: () => void
}

const { t } = getUiTranslations()

export const SurveyChoicesButtons: React.FC<Props> = ({
  numberOfAttempts,
  numberOfSubmissions,
  onAttemptClick,
  onSubmissionClick
}) => {
  const lang = useSurveyStore((state) => state.lang)

  return (
    <div className="mt-12 flex flex-col gap-4 w-full">
      <Button
        variant="secondary"
        onClick={onAttemptClick}
        disabled={numberOfAttempts === 0}>
        {t('survey.sendAsAttempt', lang)} ({numberOfAttempts}{' '}
        {(numberOfAttempts > 1
          ? t('try.plural', lang)
          : t('try', lang)
        ).toLowerCase()}
        )
      </Button>
      <HorizontalLine text="o" />
      <Button onClick={onSubmissionClick} disabled={numberOfSubmissions === 0}>
        {t('survey.sendAsSubmission', lang)} ({numberOfSubmissions}{' '}
        {(numberOfSubmissions > 1
          ? t('try.plural', lang)
          : t('try', lang)
        ).toLowerCase()}
        )
      </Button>
    </div>
  )
}
