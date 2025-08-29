import express from 'express'

import { PORT } from './config.js'
import { UserDB } from './db.js'

const app = express()
app.use(express.json())
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index')
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
    const login = await UserDB.login({ email, password })
    console.log('User validated')
    res.send(login)
  } catch (error) {
    res.status(401).send(error.message)
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
