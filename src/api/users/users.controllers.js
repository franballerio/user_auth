import AppError from '../../utils/AppError.js'

import { newToken } from '../../utils/jwt.js'
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
    
    console.log('Valid user')

    try {
      // the db manager creates the user and returns it
      const newUser = await this.model.create({ email: email, user_name: user_name, password: password })

      const token = newToken(newUser)

      console.log(`User created id: ${newUser._id}`)
      res
        .cookie('access_cookie', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60
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
      console.log(`User id: ${user._id}, user_name: ${user.user_name} validated`)
      res
      // send the token to the client so it can resend it for auth
        .cookie('access_cookie', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60
        })
        .json(user)
    } catch (error) {
      //console.log(error)
      return next(new AppError(error.message, 401))
    }
  }

  logout = (req, res) => {
    res
      .clearCookie('access_cookie')
      .json({ message: 'Logout Successful' })
  }

  clear = (req, res) => {
    this.model.clear()
    res.send(200)
  }
}