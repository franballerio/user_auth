import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_REFRESH_SECRET } from '../config/config.js'

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
    { id: user.id },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  )

  return token
}

export const newResetToken = (email) => {
  const token = jwt.sign(
    { email: email },
    JWT_SECRET,
    { expiresIn: '10m' }
  )

  return token
}

export const validateToken = (token) => {
  try {
    const validated = jwt.verify(token, JWT_SECRET)
    return validated
  } catch {
    throw new Error('Invalid access token')
  }
}

export const validateRefreshToken = (token) => {
  try {
    const validated = jwt.verify(token, JWT_REFRESH_SECRET)
    return validated
  } catch {
    throw new Error('Invalid refresh token')
  }
}
