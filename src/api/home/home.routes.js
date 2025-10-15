import { Router } from 'express'

export const homeRouter = Router()

homeRouter.get('/', (req, res) => {
  const { userData } = req.session
  if (!userData) return res.render('index')

  try {
    res.render('index', userData)
  } catch (e) {
    e
  }
})

homeRouter.get('/protected', (req, res) => {
  const { userData } = req.session

  if (!userData) res.status(403).send('Access denied')
  res.render('protected', userData)
})
