import { createHmac, timingSafeEqual } from 'node:crypto'

function getSecret(): string {
  const secret = process.env.PAYLOAD_SECRET
  if (!secret) {
    throw new Error('PAYLOAD_SECRET must be set to sign unsubscribe tokens.')
  }
  return secret
}

function base64url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function fromBase64url(input: string): string {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(
    Math.ceil(input.length / 4) * 4,
    '=',
  )
  return Buffer.from(padded, 'base64').toString('utf8')
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('hex')
}

/**
 * Returns a single-use-style token: `${base64url(email)}.${hmac}`.
 * Tokens never expire so an unsubscribe link in an old email still works.
 */
export function createUnsubscribeToken(email: string): string {
  const normalized = email.trim().toLowerCase()
  const encoded = base64url(normalized)
  const sig = sign(normalized)
  return `${encoded}.${sig}`
}

export function buildUnsubscribeUrl(email: string): string {
  const token = createUnsubscribeToken(email)
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://letsfightglio.com'
  return `${base}/api/subscribers/unsubscribe?token=${encodeURIComponent(token)}`
}

export function verifyUnsubscribeToken(token: string): string | null {
  const parts = token.split('.')
  if (parts.length !== 2) return null

  const [encoded, sig] = parts
  let email: string
  try {
    email = fromBase64url(encoded)
  } catch {
    return null
  }

  const expected = sign(email)
  const expectedBuf = Buffer.from(expected, 'hex')
  const givenBuf = Buffer.from(sig, 'hex')

  if (expectedBuf.length !== givenBuf.length) return null
  if (!timingSafeEqual(expectedBuf, givenBuf)) return null

  return email
}
