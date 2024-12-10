import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db'
import { magicLink } from 'better-auth/plugins'
import { resend } from './resend'
import * as authSchemas from '@/db/schemas/auth/auth-schema'
import { magicLinkEmail } from './emailTemplates/magicLinkEmail'
import type { languages } from '@/i18n/ui'
import { useTranslations } from '@/i18n/utils'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      ...authSchemas
    }
  }),
  plugins: [
    magicLink({
      sendMagicLink: async (
        {
          email,
          url
        }: {
          email: string
          url: string
          token: string
        },
        request?: Request
      ) => {
        const lang = (request?.headers.get('lang') ??
          'en') as keyof typeof languages
        const t = useTranslations(lang)

        await resend.emails.send({
          from: 'noreply@justask.hgo.one',
          to: email,
          subject: t('email.magicLink.subject'),
          html: magicLinkEmail(url, lang)
        })
      }
    })
  ]
})
