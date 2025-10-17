import 'dotenv/config'

// export const {
//   PORT = 3000,
//   SALT_ROUNDS = 3
// } = process.env

export const PORT = Number(process.env.PORT)
export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS)
export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
export const URI = process.env.URI_MONGODB
export const EMAIL_SENDER_USER = process.env.EMAIL_SENDER_USER
export const EMAIL_SENDER_PASSW = process.env.EMAIL_SENDER_PASSW