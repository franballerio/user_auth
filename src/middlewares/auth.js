// import AppError from '../utils/AppError.js'
import { validateToken, validateRefreshToken, newToken } from '../utils/jwt.js'
import { UserMongoDB } from '../api/users/models/users.mongo.js'

export const auth = async (req, res, next) => {
  const token = req.cookies.access_cookie || null
  // console.log(token)
  const refreshToken = req.cookies.refresh_token || null
  // console.log(refreshToken)
  const resetToken = req.params.id || null
  // console.log(resetToken)
  req.session = { userData: null }

  try {
    // First, try to validate the access token
    const payload = validateToken(token)

    console.log(payload)

    req.session.userData = payload
    console.log(`User ${payload._id} authorized`)
    return next()
  } catch {
    // Access token is invalid or expired, try refresh token
    if (refreshToken) {
      try {
        // Validate refresh token
        const payload = validateRefreshToken(refreshToken)

        // Find user by refresh token
        const user = await UserMongoDB.findByRefreshToken(refreshToken)

        if (user) {
          // Generate new access token
          const newAccessToken = newToken(user)

          // Set new access token cookie
          res.cookie('access_cookie', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 15 // 15 minutes
          })

          // Set user data
          req.session.userData = {
            id: user.id,
            email: user.email,
            user_name: user.user_name
          }

          return next()
        }
      } catch {
        // Refresh token is also invalid
      }
    }

    if (resetToken) {
      const payload = validateToken(resetToken)

      req.session.userData = payload

      return next()
    }

    // If we reach here, all tokens are invalid
    req.session.userData = null
    return next()
  }
}