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
  if (!userData)
    return res.render('protected')

  return res.render('protected', userData)
})

homeRouter.get('/reset', (req, res) => {
  return res.render('reset')
})

homeRouter.get('/newPassword', (req, res) => {
  const { userData } = req.session
  if (!userData) return res.status(403).send('Access denied')

  return res.render('change-password', userData)
})
