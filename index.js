import express from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

import { PORT, JWT_SECRET } from './config.js'
import { UserDB } from './db.js'

const app = express()
app.use(express.json())
app.use(cookieParser())
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  const token = req.cookies.acces_token

  if (!token) return res.render('index')

  try {
    const userData = jwt.verify(token, JWT_SECRET)
    res.render('index', userData)
  } catch (error) {
  }  
})

// users routes
app.get('/users', (req, res) => {
  const users = UserDB.getUsers()
  res.json(users)
})

app.post('/register', async (req, res) => {
  const { email, password } = req.body
  try {
    // the db manager creates the user and returns the id
    const id = await UserDB.create({ email, password })
    console.log(`Usuario creado correctamente ${id}`)
    res.send({ id })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await UserDB.login({ email, password })
    // create a jwtoken for session auth
    const token = jwt.sign(
      {id: user.id, email: user.email},
      JWT_SECRET,
      {expiresIn: '1h'}
    )
    console.log('User validated')
    res
      // send the token to the client so it can resend it for auth
      .cookie('acces-cookie', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60
      })
      .send(user)
  } catch (error) {
    res.status(401).send(error.message)
  }
})

app.get('/protected', (req, res) => {
  const token = req.cookies.acces_token

  if (!token) {
    res.status(301).send('Acces denied')
  }

  try {
    const userData = jwt.verify(token, JWT_SECRET)
    res.render('protected', userData)
  } catch (error) {
    res.status(401).send('Acces denied')
  }
})

app.post('/logout', (req, res) => { })

app.delete('/users', (req, res) => {
  UserDB.clear()
  res.send(200)
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
