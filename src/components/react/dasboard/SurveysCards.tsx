import { useDashboardStore } from '@/store/dashboard'
import { SurveyCard } from './SurveyCard'

const url = new URL(window.location.href)

export const SurveysCards = () => {
  const surveys = useDashboardStore((state) => state.surveys)

  return (
    <main>
      <ul className="grid grid-cols-6 gap-4">
        {surveys.map((survey) => (
          <li
            className="col-span-full md:col-span-3 xl:col-span-2"
            key={survey.id}>
            <SurveyCard
              id={survey.id}
              title={survey.title}
              url={`${url.origin}/survey/${survey.code}`}
              description={survey.description ?? undefined}
              shareCode={survey?.shareCode}
              numberOfResponses={survey.numberOfResponses ?? 0}
              lang={survey.lang}
            />
          </li>
        ))}
      </ul>
    </main>
  )
}
