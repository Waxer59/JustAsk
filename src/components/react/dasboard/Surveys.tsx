import { useDashboardStore } from '@/store/dashboard'
import { SurveyCard } from './SurveyCard'

const url = new URL(window.location.href)

export const Surveys = () => {
  const surveys = useDashboardStore((state) => state.surveys)

  return (
    <main>
      <ul className="grid grid-cols-6 gap-4">
        {surveys.map((survey) => (
          <li className="col-span-full md:col-span-3 xl:col-span-2">
            <SurveyCard
              id={survey.id}
              title={survey.title}
              url={`${url.origin}/${survey.code}`}
              description={survey.description ?? undefined}
              numberOfResponses={survey.numberOfResponses}
            />
          </li>
        ))}
      </ul>
    </main>
  )
}
