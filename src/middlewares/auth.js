// import AppError from '../utils/AppError.js'
import { validateToken, validateRefreshToken, newToken } from '../utils/jwt.js'
import { UserMongoDB } from '../api/users/models/users.mongo.js'

export const auth = async (req, res, next) => {
  const token = req.cookies.access_cookie
  const refreshToken = req.cookies.refresh_token
  req.session = { userData: null }

  try {
    // First, try to validate the access token
    const data = validateToken(token)
    req.session.userData = data
    return next()
  } catch {
    // Access token is invalid or expired, try refresh token
    if (refreshToken) {
      try {
        // Validate refresh token
        validateRefreshToken(refreshToken)

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

    // If we reach here, both tokens are invalid
    req.session.userData = null
    return next()
  }
}