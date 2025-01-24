import { buttonVariants } from '@/ui/button'
import { Card } from '@/ui/card'
import { Toaster } from '@/ui/sonner'
import { HomeIcon } from 'lucide-react'

interface Props {
  title: string
  description?: string
  children: React.ReactNode
}

export default function AuthLayout({ title, description, children }: Props) {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="p-4 max-w-sm w-full flex flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex items-center justify-center relative w-full">
            <a
              className={`${buttonVariants({ variant: 'ghost' })} absolute left-0`}
              href="/">
              <HomeIcon />
            </a>
            <h1 className="text-center text-4xl font-bold capitalize">
              {title}
            </h1>
          </div>
          {description && (
            <p className="text-center text-lg text-white/80">{description}</p>
          )}
        </div>
        {children}
      </Card>
      <Toaster />
    </div>
  )
}
