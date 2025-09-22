import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/config.js'

export const newToken = (user) => {

    const token = jwt.sign(
        { id: user.id, email: user.email, user_name: user.user_name },
        JWT_SECRET,
        { expiresIn: '1h' }
    ) 

    return token
}

export const validateToken = (token) => {
    return jwt.verify(token, JWT_SECRET)
}
