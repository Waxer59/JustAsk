import { Input } from '@ui/input'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Card } from '@ui/card'
import { Button } from '@ui/button'
import type { OffersResponse } from '@/types'
import { useInterviewStore } from '@store/interview'
import { BounceLoader } from 'react-spinners'

export const OfferSearch = () => {
  const [search, setSearch] = useState<string>('')
  const [debouncedSearch] = useDebounce(search, 1000)
  const setIsCurrentOfferManual = useInterviewStore(
    (state) => state.setIsCurrentOfferManual
  )
  const setCurrentOffer = useInterviewStore((state) => state.setCurrentOffer)
  const nextStep = useInterviewStore((state) => state.nextStep)

  const { data, isError, refetch, isLoading } = useQuery<OffersResponse>({
    enabled: false,
    retry: false,
    queryKey: ['offers', debouncedSearch],
    queryFn: () =>
      fetch(`/api/offers/${debouncedSearch}`).then((res) => res.json())
  })

  const { data: offers } = data ?? {}

  const onOfferClick = (title: string, description: string) => {
    setCurrentOffer({
      title,
      description
    })
    setIsCurrentOfferManual(false)
    nextStep()
  }

  useEffect(() => {
    if (debouncedSearch.trim().length === 0) return

    refetch()
  }, [debouncedSearch])

  useEffect(() => {
    if (isError) {
      toast.error('Something went wrong')
    }
  }, [isError])

  return (
    <div>
      <Input
        placeholder="Frontend developer"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="text-lg"
      />
      {isLoading && <BounceLoader color="#2f2f33" className="mx-auto mt-28" />}
      <ul className="mt-10 flex flex-col items-center gap-6 w-full max-h-[800px] overflow-auto pr-2">
        {offers?.map(
          ({ job_title, job_description, job_id, job_apply_link }) => (
            <li key={job_id}>
              <Card className="py-8 px-16 relative flex flex-col justify-center flex-wrap md:flex-row items-center gap-8">
                <div className="flex flex-col items-center gap-4">
                  <h2 className="text-2xl font-bold self-start">{job_title}</h2>
                  <p className="max-w-3xl text-pretty">{job_description}</p>
                  <Button variant="link" asChild>
                    <a href={job_apply_link} target="_blank">
                      Enlace a la oferta
                    </a>
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => onOfferClick(job_title, job_description)}>
                    Seleccionar oferta
                  </Button>
                </div>
              </Card>
            </li>
          )
        )}
      </ul>
    </div>
  )
}
