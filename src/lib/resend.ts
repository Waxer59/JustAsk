import { Resend } from 'resend'
export const resend = new Resend(import.meta.env.AUTH_RESEND_KEY)
