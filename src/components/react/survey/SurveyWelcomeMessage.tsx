export const SurveyWelcomeMessage = () => {
  return (
    <div className="flex flex-col gap-12 text-pretty max-w-5xl w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">Welcome to Survey DAW</h1>
        <p className="text-xl max-w-3xl text-pretty">
          Esta encuesta evaluará tus aptitudes para las entrevistas en cuestión
          de minutos. Proporciona algunos documentos, responde a algunas
          preguntas y recibe valiosos comentarios que te ayudarán a superarte.
        </p>
      </div>
    </div>
  )
}
