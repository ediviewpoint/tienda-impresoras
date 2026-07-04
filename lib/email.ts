import { Resend } from 'resend'

let _resend: Resend | null = null

export function getResend(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY')
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

export const FROM = 'PrintMax <no-reply@printmax.mx>'
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@printmax.mx'
