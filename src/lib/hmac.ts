import crypto from 'node:crypto'

const KEY = import.meta.env.HMAC_KEY
const algorithm = 'sha256'

export const createHmac = (text: string, timestamp: number = Date.now()) => {
  const payload = JSON.stringify({
    payload: text,
    timestamp
  })

  return {
    key: crypto.createHmac(algorithm, KEY).update(payload).digest('hex'),
    timestamp
  }
}
