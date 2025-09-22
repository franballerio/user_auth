import express from 'express'
import cookieParser from 'cookie-parser'

import AppError from './utils/error.js';
import { PORT } from './config/config.js'
import { auth } from './middlewares/auth.js'
import { errHandler } from './middlewares/err.js'
import { usersRouter } from './api/users/users.routes.js'
import { homeRouter } from './api/home/home.routes.js'
import { UserDB } from './api/users/models/users.dblocal.js'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.disable('X-Powered-By')
app.set('view engine', 'ejs')
// auth middleware
app.use(auth)

// routes
app.use('/home', homeRouter)
app.use('/users', usersRouter({ model: UserDB }))

// A route for handling non-existent paths
app.all('/', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errHandler)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
