import { getLangFromUrl, useTranslations } from '@/i18n/utils'
import { useUiStore } from '@/store/ui'
import { numberOfSteps } from '@/types'
import { useInterviewStore } from '@store/interview'
import { Button } from '@ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const url = new URL(window.location.href)
const lang = getLangFromUrl(url)

export const ControlButtons = () => {
  const disableControlButtons = useUiStore(
    (state) => state.disableControlButtons
  )
  const t = useTranslations(lang)
  const currentStep = useInterviewStore((state) => state.currentStep)
  const nextStep = useInterviewStore((state) => state.nextStep)
  const prevStep = useInterviewStore((state) => state.prevStep)

  return (
    <div className="flex items-center justify-center gap-4">
      {currentStep > 0 && (
        <Button
          onClick={prevStep}
          variant="secondary"
          disabled={disableControlButtons}>
          <ArrowLeft className="stroke-1" /> {t('controlButton.previous')}
        </Button>
      )}
      {currentStep < numberOfSteps - 2 && (
        <Button
          onClick={nextStep}
          variant="secondary"
          disabled={disableControlButtons}>
          {t('controlButton.next')} <ArrowRight className="stroke-1" />
        </Button>
      )}
    </div>
  )
}
