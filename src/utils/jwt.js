import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/config.js'

export const newToken = (user) => {
  const token = jwt.sign(
    { id: user.id, email: user.email, user_name: user.user_name },
    JWT_SECRET,
    { expiresIn: '15m' }
  )

  return token
}

export const newRefreshToken = (user) => {
  const token = jwt.sign(
    { id: user.id, email: user.email, user_name: user.user_name },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  return token
}


export const validateToken = (token) => {
  const validated = jwt.verify(token, JWT_SECRET)
  return validated
}
