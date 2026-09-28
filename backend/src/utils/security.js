const crypto = require('crypto')

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'sislog-choco-desarrollo-2026'
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const derived = crypto.scryptSync(String(password), salt, 64).toString('hex')
  return `scrypt$${salt}$${derived}`
}

function verifyPassword(password, stored) {
  try {
    const [algorithm, salt, expectedHex] = String(stored).split('$')
    if (algorithm !== 'scrypt' || !salt || !expectedHex) return false
    const actual = crypto.scryptSync(String(password), salt, 64)
    const expected = Buffer.from(expectedHex, 'hex')
    return actual.length === expected.length && crypto.timingSafeEqual(actual, expected)
  } catch {
    return false
  }
}

function base64url(value) {
  return Buffer.from(value).toString('base64url')
}

function signToken(user) {
  const payload = {
    sub: user.id,
    role: user.role,
    exp: Date.now() + TOKEN_TTL_MS
  }
  const encoded = base64url(JSON.stringify(payload))
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(encoded).digest('base64url')
  return `${encoded}.${signature}`
}

function verifyToken(token) {
  const [encoded, signature] = String(token || '').split('.')
  if (!encoded || !signature) throw new Error('Token inválido')
  const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(encoded).digest('base64url')
  const actualBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (actualBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(actualBuffer, expectedBuffer)) {
    throw new Error('Firma inválida')
  }
  const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'))
  if (!payload.exp || Date.now() > payload.exp) throw new Error('Token expirado')
  return payload
}

module.exports = { hashPassword, verifyPassword, signToken, verifyToken }
