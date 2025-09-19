import express from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

import { PORT, JWT_SECRET } from './config/config.js'
import { UserDB } from './db.js'

const app = express()
app.use(express.json())
app.use(cookieParser())
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

app.get('/', (req, res) => {
  const { userData } = req.session
  if (!userData) return res.render('index')

  try {
    res.render('index', userData)
  } catch {}  
})

// users routes
app.use('/users', )

app.get('/protected', (req, res) => {
  const { userData } = req.session

  if (!userData) res.status(403).send('Acces denied')
  res.render('protected', userData)
})



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
