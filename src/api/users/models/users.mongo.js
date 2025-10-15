import { MongoClient, ServerApiVersion } from 'mongodb'
import bcrypt from 'bcrypt'

import { URI, SALT_ROUNDS } from '../../../config/config.js'

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

client.connect()

// creatin the database and the collection schema
const db = client.db('user_auth')
const users = db.collection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['user_name', 'email', 'password'],
      properties: {
        user_name: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        email: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        password: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        refreshToken: {
          bsonType: 'string',
          description: 'refresh token for the user'
        }
      }
    }
  }
})

export class UserMongoDB {

  static async create({ email, user_name, password }) {
    const query = {
      $or: [
        { user_name: user_name },
        { email: email }
      ]
    }

    const existentUser = await users.findOne(query)
    console.log( existentUser )

    if ( existentUser ) {
      console.log(existentUser)
      throw new Error('Already registered')
    }

    const user = {
      _id: crypto.randomUUID(),
      email: email,
      user_name: user_name,
      password: await bcrypt.hash(password, SALT_ROUNDS),
      refreshToken: null
    }

    const newUser = await users.insertOne(user)

    //console.info(newUser)
    return user
  }

  static async updateRefreshToken(userId, refreshToken) {
    await users.updateOne(
      { _id: userId },
      { $set: { refreshToken: refreshToken } }
    )
  }

  static async findByRefreshToken(refreshToken) {
    const user = await users.findOne({ refreshToken })
    return user ? {
      id: user._id,
      email: user.email,
      user_name: user.user_name
    } : null
  }

  static users() {

    const all = users.find({}).toArray()

    return all
  }

  static clear() {
    users.deleteMany({})
    return
  }

  static async login({ credential, password }) {
    const query = {
      $or: [
        { user_name: credential },
        { email: credential }
      ]
    }

    const user = await users.findOne( query )
    const validPassw = user === undefined
      ? false
      : await bcrypt.compare(password, user.password)

    if (!(validPassw && user)) {
      throw new Error('Invalid Credentials')
    }

    return user
  }
}