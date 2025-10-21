// import AppError from '../utils/AppError.js'
import { validateToken, validateRefreshToken, newToken /*, validateResetToken */ } from '../utils/jwt.js'
import { UserDB } from '../api/users/models/users.dblocal.js'

export const auth = async (req, res, next) => {
  const token = req.cookies.access_cookie || null
  const refreshToken = req.cookies.refresh_cookie || null
  const resetToken = req.query.token || null
  req.session = { userData: null }

  // Try access token first (don't throw so refresh can run)
  if (token) {
    console.log('access token ok')
    try {
      const payload = validateToken(token)
      req.session.userData = payload
      return next()
    } catch (e) {
      console.warn('Access token invalid:', e.message)
    }
  }

  if (refreshToken) {
    console.log('refresh token ok')
    try {
      const payload = validateRefreshToken(refreshToken)
      const user = await UserDB.findByRefreshToken(refreshToken)

      if (user) {
        const newAccessToken = newToken(user)

        req.session.userData = {
          id: user._id ?? user.id,
          email: user.email,
          user_name: user.user_name
        }

        res.cookie('access_cookie', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 15
        })

        return next()
      }
    } catch (e) {
      console.warn('Refresh token invalid or DB error:', e.message)
    }
  }

  if (resetToken) {
    console.log('reset token ok')
    try {
      const payload = validateToken(resetToken)
      req.session.userData = payload
      return next()
    } catch (e) {
      console.warn('Reset token invalid:', e.message)
    }
  }

  console.warn('No token at all')
  // Not authenticated
  req.session.userData = null
  return next()
}
