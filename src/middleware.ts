import { auth } from '@/lib/auth'
import { sequence } from 'astro:middleware'
import { getLangFromUrl } from '@/i18n/utils'
import { getRelativeLocaleUrl } from 'astro:i18n'
import type { MiddlewareHandler } from 'astro'
import { PRIVATE_ROUTES } from './constants'

const protectRouteMiddleware: MiddlewareHandler = async (context, next) => {
  const user = context.locals.user
  const url = new URL(context.request.url)
  const lang = getLangFromUrl(url)
  const relativeLoginUrl = getRelativeLocaleUrl(lang, 'login')

  const isPrivateRoute = PRIVATE_ROUTES.some((route) =>
    url.pathname.startsWith(route)
  )

  if (!user && isPrivateRoute) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: relativeLoginUrl
      }
    })
  }

  return next()
}
const authMiddleware: MiddlewareHandler = async (context, next) => {
  const isAuthed = await auth.api.getSession({
    headers: context.request.headers
  })

  if (isAuthed) {
    context.locals.user = isAuthed.user
    context.locals.session = isAuthed.session
  } else {
    context.locals.user = null
    context.locals.session = null
  }

  return next()
}

export const onRequest = sequence(authMiddleware, protectRouteMiddleware)
