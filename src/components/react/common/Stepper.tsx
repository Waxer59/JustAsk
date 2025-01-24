interface Props {
  steps: string[]
  currentStep: number
}

export const Stepper: React.FC<Props> = ({ steps, currentStep }) => {
  return (
    <ol className="flex items-center w-full text-sm font-medium text-center text-zinc-500 dark:text-zinc-400 sm:text-base">
      {steps.map((step, idx) => (
        <li
          key={step}
          className={`${idx === steps.length - 1 ? 'flex items-center' : "flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-zinc-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-zinc-700"} ${idx === currentStep ? 'text-primary' : ''}`}>
          <span
            className={`flex items-center ${idx !== steps.length - 1 ? "after:content-['/']" : ''} sm:after:hidden after:mx-2 after:text-zinc-200 dark:after:text-zinc-500`}>
            <span className="me-2">{idx + 1}.</span>
            {step}
          </span>
        </li>
      ))}
    </ol>
  )
}
