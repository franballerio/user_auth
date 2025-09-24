import { MongoClient, ServerApiVersion } from 'mongodb';
import bcrypt from 'bcrypt'

import { uri } from '../../../config/config.js'

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
})

client.connect()

const db = client.db("user_auth")

const Users = db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_name", "email", "password"],
      properties: {
        user_name: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        email: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        password: {
          bsonType: "string",
          description: "must be a string and is required"
        }
      }
    }
  }
})

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


export class UserMongoDB {

  static async create({ email, user_name, password }) {

    const query = { 
        $or: [
            { user_name: user_name },
            { email: email }
        ]
     }

    const existentUser = Users.findOne(query)


    if (! existentUser ) {

      const user = {
        _id: crypto.randomUUID(),
        email: email,
        user_name: user_name,
        password: await bcrypt.hash(password, SALT_ROUNDS)
      }

      const newUser = (await Users).insertOne(user)

      console.log(newUser)
      return user
    } else {
      throw new Error('Already registered')
    }
  }

  static users() {
    return Users.find(user => user)
  }

  static clear() {
    Users.remove(user => user)
    return
  }

  static async login({ userORemail, password }) {

    const user = await Users.findOne(u => u.user_name === userORemail || u.email === userORemail)
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