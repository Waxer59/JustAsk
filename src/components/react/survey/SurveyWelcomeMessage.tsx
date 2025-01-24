import { getUiTranslations } from '@/i18n/utils'

interface Props {
  surveyName: string
  surveyDescription?: string
}

const { t } = getUiTranslations()

export const SurveyWelcomeMessage = ({
  surveyName,
  surveyDescription
}: Props) => {
  return (
    <div className="flex flex-col gap-12 text-pretty max-w-5xl w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">
          {t('survey.salute') + ' ' + surveyName}
        </h1>
        <p className="text-xl max-w-3xl text-pretty">
          {surveyDescription ? surveyDescription : t('survey.description')}
        </p>
      </div>
    </div>
  )
}
