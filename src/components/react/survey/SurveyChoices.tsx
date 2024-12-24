import { Button } from '@/ui/button'
import { HorizontalLine } from '../common/HorizontalLine'

export const SurveyChoices = () => {
  return (
    <div>
      <h2 className="text-4xl text-center font-semibold italic">
        Elige una opción
      </h2>
      <div className="mt-12 flex flex-col gap-4 w-full">
        <Button variant="secondary">Entrenar (3 intentos)</Button>
        <HorizontalLine text="o" />
        <Button>Enviar como intento (1 intento)</Button>
      </div>
    </div>
  )
}
