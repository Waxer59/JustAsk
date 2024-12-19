import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs'
import { OfferManual } from './OfferManual'
import { OfferSearch } from './OfferSearch'
import { useInterviewStore } from '@/store/interview'
import { getLangFromUrl, useTranslations } from '@/i18n/utils'

const url = new URL(window.location.href)
const lang = getLangFromUrl(url)
const t = useTranslations(lang)

export const OfferStep = () => {
  const isCurrentOfferManual = useInterviewStore(
    (state) => state.isCurrentOfferManual
  )

  return (
    <Tabs
      defaultValue={isCurrentOfferManual ? 'manual' : 'search'}
      className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="search">{t('step1.tab.1')}</TabsTrigger>
        <TabsTrigger value="manual">{t('step1.tab.2')}</TabsTrigger>
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
