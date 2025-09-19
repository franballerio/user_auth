import express from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

import { PORT, JWT_SECRET } from './config/config.js'
import { usersRouter } from './api/users/users.routes.js'
import { homeRouter } from './api/home/home.routes.js'
import { UserDB } from './api/users/models/users.dblocal.js'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.disable('X-Powered-By')
app.set('view engine', 'ejs')

// auth middleware
app.use((req, res, next) => {
  const token = req.cookies.access_cookie
  req.session = { userData: null }
  
  try {
    const data = jwt.verify(token, JWT_SECRET)
    req.session.userData = data
  } catch {}
  
  next()
})

const userRouter = usersRouter({ model: UserDB })
// routes
app.use('/home', homeRouter)
app.use('/users', userRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
