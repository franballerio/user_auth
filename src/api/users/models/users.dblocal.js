import DBlocal from 'db-local'
import bcrypt from 'bcrypt'

import { SALT_ROUNDS } from '../../../config/config.js'

const { Schema } = new DBlocal({ path: './db' })
// this is the local database, is like a create table
const User = Schema('User', {
  _id: { type: String, required: true },
  user_name: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  refreshToken: { type: String }
})

export class UserDB {
  static async create({ email, user_name, password }) {

    const existentEmail = User.findOne({ email })
    const existentUser_name = User.findOne({ user_name })

    if (!existentUser_name && !existentEmail) {

      const user = {
        _id: crypto.randomUUID(),
        email: email,
        user_name: user_name,
        password: await bcrypt.hash(password, SALT_ROUNDS),
        refreshToken: null
      }

      User.create(user).save()

      return user
    } else {
      throw new Error('Already registered')
    }
  }

  static users() {
    return User.find(user => user)
  }

  static async userById({ id }) {
    const user = await User.findOne(u => u._id === id)

    if (!user) {
      throw new Error('User not found')
    }

    return user
  }

  static async updateRefreshToken(userId, refreshToken) {
    const user = await User.findOne(u => u._id === userId)
    if (user) {
      user.refreshToken = refreshToken
      User.update(user).save()
    }
  }

  static async findByRefreshToken(refreshToken) {
    const user = await User.findOne(u => u.refreshToken === refreshToken)
    if (user) {
      return {
        id: user._id,
        email: user.email,
        user_name: user.user_name
      }
    }
    return null
  }

  static clear() {
    User.remove(user => user)
    return
  }

  static async login({ credential, password }) {

    const user = await User.findOne(u => u.user_name === credential || u.email === credential)
    console.log(user)
    const validPassw = user === undefined
      ? false
      : await bcrypt.compare(password, user.password)

    if (!(validPassw && user)) {
      throw new Error('Invalid Credentials')
    }

    return {
      _id: user._id,
      email: user.email,
      user_name: user.user_name
    }
  }
}
