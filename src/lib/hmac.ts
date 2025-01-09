import crypto from 'node:crypto'

const KEY = import.meta.env.HMAC_KEY
const algorithm = 'sha256'

export const createHmac = (text: string) => {
  const timestamp = Date.now()

  const payload = JSON.stringify({
    payload: text,
    timestamp
  })

  return {
    key: crypto.createHmac(algorithm, KEY).update(payload).digest('hex'),
    timestamp
  }
}

export const isHmacValid = (text: string, hmac: string): boolean =>
  createHmac(text).key === hmac
