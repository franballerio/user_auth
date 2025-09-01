import DBlocal from 'db-local'
import bcrypt from 'bcrypt'

import { SALT_ROUNDS } from './config.js'
import { validateUser, validateUpdate } from './schemas/user.js'
// import { z } from 'zod'

const { Schema } = new DBlocal({ path: './db' })
// this is the local database, is like a create table
const User = Schema('User', {
  _id: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
})

export class UserDB {
  static async create({ email, password }) {
    // validate user first
    const validUser = validateUser({ email, password })

    if (validUser.success) {
      const user = User.findOne({ email })
      if (!user) {
        const id = crypto.randomUUID()
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

        User.create({
          _id: id,
          email,
          password: hashedPassword
        }).save()

        return id
      } else {
        throw new Error('User already exists')
      }
    } else {
      return validUser.error.message
      // return z.treeifyError(validUser.error).properties
    }
  }

  static getUsers() {
    return User.find(user => user)
  }

  static clear() {
    User.remove(user => user)
  }

  static async login({ email, password }) {
    const validUser = validateUser({ email, password })

    if (validUser.success) {
      const user = User.findOne({ email })

      if (user) {
        const validPass = await bcrypt.compare(password, user.password)
        if (validPass) {
          return {
            message: 'Login Succesful',
            _id: user._id,
            email: user.email
          }
        } else {
          throw new Error('Incorrect password')
        }
      } else {
        throw new Error('User doesnt exist')
      }
    } else {
      throw new Error('Invalid input')
    }
  }
}
