import { ui, defaultLang } from './ui'

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/')
  if (lang in ui) return lang as keyof typeof ui
  return defaultLang
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key]
  }
}

export const getUiTranslations = () => {
  const url = new URL(window.location.href)
  const lang = getLangFromUrl(url)
  const t = useTranslations(lang)

  return {
    t,
    lang
  }
}
