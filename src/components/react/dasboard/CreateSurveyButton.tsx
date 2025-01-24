import { getUiTranslations } from '@/i18n/utils'
import { useUiStore } from '@/store/ui'
import { Button } from '@/ui/button'

const { t } = getUiTranslations()

export function CreateSurveyButton() {
  const setIsCreatingSurvey = useUiStore((state) => state.setIsCreatingSurvey)

  return (
    <Button onClick={() => setIsCreatingSurvey(true)}>
      {t('dashboard.createSurvey')}
    </Button>
  )
}
