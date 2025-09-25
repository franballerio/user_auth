import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import AppError from './utils/AppError.js';
import { PORT } from './config/config.js'
import { auth } from './middlewares/auth.js'
import { errHandler } from './middlewares/err.js'
import { usersRouter } from './api/users/users.routes.js'
import { homeRouter } from './api/home/home.routes.js'
// import { UserDB } from './api/users/models/users.dblocal.js'
import { UserMongoDB } from './api/users/models/users.mongo.js'

const app = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.disable('X-Powered-By')
app.set('view engine', 'ejs')
// auth middleware
app.use(auth)

// routes
app.use('/home', homeRouter)
app.use('/users', usersRouter({ model: UserMongoDB }))

// A route for handling non-existent paths
app.all('/', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errHandler)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
