import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs'
import { OfferManual } from './OfferManual'
import { OfferSearch } from './OfferSearch'
import { useInterviewStore } from '@/store/interview'

export const OfferStep = () => {
  const isCurrentOfferManual = useInterviewStore(
    (state) => state.isCurrentOfferManual
  )

  return (
    <Tabs
      defaultValue={isCurrentOfferManual ? 'manual' : 'search'}
      className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="search">Search</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>
      <TabsContent value="search" className="mt-12">
        <OfferSearch />
      </TabsContent>
      <TabsContent value="manual" className="mt-12">
        <OfferManual />
      </TabsContent>
    </Tabs>
  )
}
