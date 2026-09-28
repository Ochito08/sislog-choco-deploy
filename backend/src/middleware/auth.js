const { readDatabase, publicUser } = require('../data/store')

const { signToken, verifyToken } = require('../utils/security')

function authenticate(req, res, next) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')
  if (scheme !== 'Bearer' || !token) return res.status(401).json({ error: 'Debes iniciar sesión.' })

  try {
    const payload = verifyToken(token)
    const db = readDatabase()
    const user = db.users.find(item => item.id === Number(payload.sub) && item.active)
    if (!user) return res.status(401).json({ error: 'La sesión ya no es válida.' })
    req.user = publicUser(user)
    next()
  } catch {
    return res.status(401).json({ error: 'La sesión expiró o no es válida.' })
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'No tienes permisos para realizar esta acción.' })
    }
    next()
  }
}

module.exports = { authenticate, authorize, signToken }
