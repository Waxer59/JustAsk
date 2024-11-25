import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { useRef } from 'react'

export const LoginForm = () => {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      className="flex flex-col items-center justify-center w-full gap-4">
      <Input placeholder="Email" type="email" required autoComplete="email" />
      <Button type="submit">Send magic link</Button>
    </form>
  )
}
