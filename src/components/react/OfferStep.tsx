import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs'
import { OfferManual } from './OfferManual'

export const OfferStep = () => {
  return (
    <Tabs defaultValue="link" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="link">Enlace</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>
      <TabsContent value="link" className="mt-12">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="manual" className="mt-12">
        <OfferManual />
      </TabsContent>
    </Tabs>
  )
}
