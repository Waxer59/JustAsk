import { Stepper } from '../common/Stepper'

export const Survey = () => {
  return (
    <>
      <header className="mt-28 flex flex-col gap-10">
        <Stepper
          steps={['Indentidad', 'Documentos', 'Preparacion', 'Preguntas']}
          currentStep={0}
        />
        <div className="flex flex-col gap-12 items-center justify-center max-w-5xl mx-auto pb-5">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold">Welcome to Survey DAW</h1>
            <p className="text-xl max-w-5xl text-pretty">
              This survey will assess your interview skills in minutes! Provide
              a few documents, answer some questions, and receive valuable
              feedback to help you excel.
            </p>
          </div>
        </div>
      </header>
      <main></main>
    </>
  )
}
