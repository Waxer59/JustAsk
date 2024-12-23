import { getLangFromUrl, useTranslations } from '@/i18n/utils'
import { Button } from '@ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const url = new URL(window.location.href)
const lang = getLangFromUrl(url)
const t = useTranslations(lang)

interface Props {
  currentStep: number
  totalSteps: number
  hideNextControlButtonStep?: number
  hidePrevControlButtonStep?: number
  disableControlButtons?: boolean
  disableNextControlButton?: boolean
  disablePrevControlButton?: boolean
  onNext?: () => void
  onPrev?: () => void
}

export const ControlButtons: React.FC<Props> = ({
  currentStep,
  totalSteps,
  disableControlButtons,
  hideNextControlButtonStep = totalSteps - 1,
  hidePrevControlButtonStep = 0,
  disableNextControlButton,
  disablePrevControlButton,
  onNext,
  onPrev
}) => {
  return (
    <div className="flex items-center justify-center gap-4">
      {currentStep > hidePrevControlButtonStep && (
        <Button
          onClick={() => onPrev?.()}
          variant="secondary"
          disabled={disableControlButtons || disablePrevControlButton}>
          <ArrowLeft className="stroke-1" /> {t('controlButton.previous')}
        </Button>
      )}
      {currentStep < hideNextControlButtonStep && (
        <Button
          onClick={() => onNext?.()}
          variant="secondary"
          disabled={disableControlButtons || disableNextControlButton}>
          {t('controlButton.next')} <ArrowRight className="stroke-1" />
        </Button>
      )}
    </div>
  )
}
