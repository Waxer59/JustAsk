import { defaultLang, languages } from '@/i18n/ui'
import { getLangFromUrl } from '@/i18n/utils'
import { Button } from '@/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@ui/popover'

const url = new URL(window.location.href)
const lang = getLangFromUrl(url)
const langsWithoutCurrentLang = Object.keys(languages).filter((l) => l !== lang)

export const LanguagePicker = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="uppercase" variant="outline">
          {lang}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <ul className="flex flex-col items-center gap-2 uppercase">
          {langsWithoutCurrentLang.map((l) => (
            <li key={l}>
              <Button asChild variant="ghost">
                <a href={l !== defaultLang ? `/${l}` : '/'} data-astro-reload>
                  {l}
                </a>
              </Button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
