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

    if (existentUser_name || existentEmail) {
      throw new Error('Error creating user')
    }

    const user = {
      _id: crypto.randomUUID(),
      email: email,
      user_name: user_name,
      password: await bcrypt.hash(password, SALT_ROUNDS),
      refreshToken: ''
    }

    User.create(user).save()

    console.log('[INFO] New user created with id:', user._id)

    return {
      _id: user._id,
      email: user.email,
      user_name: user.user_name,
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

  static async userByEmail({ email }) {
    const user = await User.findOne(u => u.email === email)

    if (!user) {
      return null
    }

    return user
  }

  static async updateRefreshToken(userId, token) {
    const user = await User.findOne(u => u._id === userId)

    if (user) {
      user.update({ refreshToken: token }).save()
    }

    const userUpdated = await User.findOne(u => u._id === userId)
    console.log('[INFO] refreshToken updated for:', userUpdated)
    return
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
