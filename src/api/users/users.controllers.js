import { createTransport } from 'nodemailer'

import { EMAIL_SENDER_USER, EMAIL_SENDER_PASSW } from '../../config/config.js'
import AppError from '../../utils/AppError.js'
import { newToken, newRefreshToken, newResetToken, validateToken, validateRefreshToken } from '../../utils/jwt.js'
import { validateLogin, validateRegister, zodError } from './users.schemas.js'

export class Controller {
  constructor({ model }) {
    this.model = model
  }

  users = async (req, res) => {
    const users = await this.model.users()
    return res.json(users)
  }

  register = async (req, res, next) => {
    const { email, user_name, password } = req.body
    // validate user info first
    const validUser = validateRegister({ email, user_name, password })

    if (!validUser.success) {
      const err = zodError(validUser.error)
      return next(new AppError(err[0], 400))
    }

    try {
      const newUser = await this.model.create({ email: email, user_name: user_name, password: password })
      const token = newToken(newUser)
      const refreshToken = newRefreshToken(newUser._id)

      // Store refresh token in database
      await this.model.updateRefreshToken(newUser._id, refreshToken)

      console.log(`User created, id: ${newUser._id}`)

      res
        .cookie('access_cookie', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 15 // 15 mins
        })
        .cookie('refresh_cookie', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        })
        .status(201)
        .json(newUser)
    } catch (error) {
      return next(new AppError(error.message, 409))
    }
  }

  login = async (req, res, next) => {
    const { credential, password } = req.body

    const validUser = validateLogin({ credential: credential, password: password })

    if (!validUser.success) {
      //console.log(validUser.error)
      return next(new AppError('Invalid credentials', 401))
    }

    try {
      const user = await this.model.login({ credential: credential, password: password })
      // create a jwtoken for session auth
      const token = newToken(user)
      const refreshToken = newRefreshToken(user._id)

      // Store refresh token in database
      await this.model.updateRefreshToken(user._id, refreshToken)

      console.log(`User id: ${user._id}, user_name: ${user.user_name} validated`)
      res
      // send the token to the client so it can resend it for auth
        .cookie('access_cookie', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 15 // 15 mins
        })
        .cookie('refresh_cookie', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        })
        .status(202)
        .json(user)
    } catch (error) {
      //console.log(error)
      return next(new AppError(error.message, 401))
    }
  }

  refresh = async (req, res, next) => {
    const refreshToken = req.cookies.refresh_cookie

    if (!refreshToken) {
      return next(new AppError('No refresh token provided', 401))
    }

    try {
      // Validate refresh token
      validateRefreshToken(refreshToken)

      // Find user by refresh token
      const existentUser = await this.model.findByRefreshToken(refreshToken)
      if (!existentUser) {
        return next(new AppError('User not found', 401))
      }

      // Issue a new access token
      const newAccessToken = newToken(existentUser)

      res
        .cookie('access_cookie', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 15
        })
        .json({ message: 'Token refreshed successfully' })

    } catch {
      return next(new AppError('Invalid or expired refresh token', 403))
    }
  }

  logout = (req, res) => {
    res
      .clearCookie('access_cookie')
      .json({ message: 'Logout Successful' })
  }

  reqNewPassw = async (req, res, next) => {
    const { email } = req.body

    const user = await this.model.userByEmail({ email: email })

    if (!user) {
      return res.status(200).json({ message: 'Email sent' })
    }

    console.info('Existent email found')

    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_SENDER_USER,
        pass: EMAIL_SENDER_PASSW
      }
    })

    const token = newResetToken(email)

    const mailConfig = {
      from: EMAIL_SENDER_USER,
      to: email,
      subject: 'Password reset from user auth',
      text: `
Hello, ${user.user_name}, your password reset link is this one:
http://localhost:3030/newPassword?token=${token}

Please do not share it with anyone.
      
If you do not requested this, just ignore it.
`
    }

    try {
      transporter.sendMail(mailConfig, (error) => {
        if (error) {
          console.log(error)
          throw error
        }
        console.log('[ACTION][RESET] Email sent')
      })

      return res.status(200).json({ message: 'Email sent' })
    } catch (error) {
      return next(new AppError(error.message || 'Failed to send email', 400))
    }
  }

  newPassword = (req, res, next) => {}

  clear = (req, res) => {
    this.model.clear()
    res.send(200)
  }
}