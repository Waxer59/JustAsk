import type { languages } from '@/i18n/ui'
import { useTranslations } from '@/i18n/utils'

export const magicLinkEmail = (url: string, lang: keyof typeof languages) => {
  const t = useTranslations(lang)

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JustAsk</title>
  </head>
  <body style="font-family: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'; background-color: #09090b; color: white; margin: 0; padding: 0; box-sizing: border-box;">
    <table role="presentation" style="width: 100%; border-spacing: 0; margin: 0; padding: 0; background-color: #09090b; color: white; margin: 0 auto;">
      <tr>
        <td style="padding: 20px; text-align: center;">
          <table role="presentation" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #09090b; border-spacing: 0; text-align: center;">
            <!-- Header -->
            <tr>
              <td style="padding: 20px;">
                <h1 style="font-size: 24px; margin: 0; color: white;">${t('email.magicLink.title')}</h1>
                <p style="font-size: 16px; margin: 10px 0 0; color: white;">${t('email.magicLink.subtitle')}</p>
              </td>
            </tr>
            <!-- Button -->
            <tr>
              <td style="padding: 20px; text-align: center;">
                <a href="${url}" style="font-size: 14px; text-decoration: none; color: black; background-color: white; padding: 10px 20px; border-radius: 5px; display: inline-block;">${t('email.magicLink.btn')}</a>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="padding: 20px; text-align: center; color: #9ca3af;">
                <a href="${url}" style="font-size: 14px; color: #9ca3af;">${url}</a>
                <p style="font-size: 12px; margin: 10px 0;">${t('email.magicLink.footer')}</p>
                <p style="font-size: 10px; color: #6b7280; margin: 0;">${t('email.magicLink.footer.warn')}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
}
