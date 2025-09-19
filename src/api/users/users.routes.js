import { Router } from 'express'
import { Controller } from './users.controllers.js'


export function usersRouter({ model }) {
  
  const controller = new Controller({ model: model })
  const router = Router()
  
  router.get('/', controller.users)
  
  router.post('/register', controller.register)
  router.post('/login', controller.login)
  router.post('/logout', controller.logout)
  
  router.delete('/', controller.clear)

  return router
}
