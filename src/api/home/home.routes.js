import { Router } from 'express'

export const homeRouter = Router()

homeRouter.get('/', (req, res) => {
  const { userData } = req.session

  if (!userData) {
    console.log('[INFO] no-auth user entering login page')
    return res.render('index')
  }

  console.log('[INFO] auth user entering login page')
  return res.render('index', userData)
})

homeRouter.get('/protected', (req, res) => {
  const { userData } = req.session

  if (!userData) {
    console.log('[INFO] no-auth user entering protected page')
    return res.render('protected')
  }

  console.log('[INFO] auth user entering protected page')
  return res.render('protected', userData)
})

homeRouter.get('/reset', (req, res) => {
  return res.render('reset')
})

homeRouter.get('/newPassword', (req, res) => {
  const { userData } = req.session

  if (!userData) {
    console.log('[INFO] no-auth user trying reset-password page. Acces denied')
    return res.status(403).send('Access denied')
  }

  console.log('[INFO] auth user entering new-password page')
  return res.render('newPassword', userData)
})
