import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals'
import { Controller } from '../../../src/api/users/users.controllers.js'
import { UserDB } from '../../../src/api/users/models/users.dblocal.js'
import AppError from '../../../src/utils/AppError.js'

// Mock the UserDB
jest.mock('../../../src/api/users/models/users.dblocal.js')

describe('Users Controller', () => {
  let controller, req, res, next, mockModel

  beforeEach(() => {
    mockModel = {
      users: jest.fn(),
      create: jest.fn(),
      login: jest.fn(),
      clear: jest.fn()
    }

    controller = new Controller({ model: mockModel })

    req = {
      body: {},
      cookies: {}
    }

    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    }

    next = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('users', () => {
    test('should return all users', async () => {
      const mockUsers = [
        { _id: '1', email: 'user1@test.com', user_name: 'user1' },
        { _id: '2', email: 'user2@test.com', user_name: 'user2' }
      ]
      mockModel.users.mockResolvedValue(mockUsers)

      await controller.users(req, res)

      expect(mockModel.users).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith(mockUsers)
    })

    test('should handle empty users list', async () => {
      mockModel.users.mockResolvedValue([])

      await controller.users(req, res)

      expect(mockModel.users).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith([])
    })
  })

  describe('register', () => {
    test('should register a new user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        user_name: 'testuser',
        password: 'password123'
      }
      const mockUser = {
        _id: 'user123',
        ...userData,
        password: 'hashedpassword'
      }

      req.body = userData
      mockModel.create.mockResolvedValue(mockUser)

      await controller.register(req, res, next)

      expect(mockModel.create).toHaveBeenCalledWith(userData)
      expect(res.cookie).toHaveBeenCalledWith(
        'access_cookie',
        expect.any(String),
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60
        })
      )
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(mockUser)
    })

    test('should handle validation errors', async () => {
      const invalidUserData = {
        email: 'invalid-email',
        user_name: 'x',
        password: 'short'
      }

      req.body = invalidUserData

      await controller.register(req, res, next)

      expect(next).toHaveBeenCalledWith(expect.any(AppError))
      expect(mockModel.create).not.toHaveBeenCalled()
    })

    test('should handle database errors', async () => {
      const userData = {
        email: 'test@example.com',
        user_name: 'testuser',
        password: 'password123'
      }

      req.body = userData
      mockModel.create.mockRejectedValue(new Error('Database error'))

      await controller.register(req, res, next)

      expect(next).toHaveBeenCalledWith(expect.any(AppError))
      const errorCall = next.mock.calls[0][0]
      expect(errorCall.statusCode).toBe(409)
    })
  })

  describe('login', () => {
    test('should login with valid credentials', async () => {
      const loginData = {
        userORemail: 'test@example.com',
        password: 'password123'
      }
      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        user_name: 'testuser'
      }

      req.body = loginData
      mockModel.login.mockResolvedValue(mockUser)

      await controller.login(req, res, next)

      expect(mockModel.login).toHaveBeenCalledWith({
        userORemail: loginData.userORemail,
        password: loginData.password
      })
      expect(res.cookie).toHaveBeenCalledWith(
        'access_cookie',
        expect.any(String),
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60
        })
      )
      expect(res.json).toHaveBeenCalledWith(mockUser)
    })

    test('should handle login validation errors', async () => {
      const invalidLoginData = {
        userORemail: '',
        password: 'short'
      }

      req.body = invalidLoginData

      await controller.login(req, res, next)

      expect(next).toHaveBeenCalledWith(expect.any(AppError))
      expect(mockModel.login).not.toHaveBeenCalled()
    })

    test('should handle invalid credentials', async () => {
      const loginData = {
        userORemail: 'test@example.com',
        password: 'wrongpassword'
      }

      req.body = loginData
      mockModel.login.mockRejectedValue(new Error('Invalid Credentials'))

      await controller.login(req, res, next)

      expect(next).toHaveBeenCalledWith(expect.any(AppError))
      const errorCall = next.mock.calls[0][0]
      expect(errorCall.statusCode).toBe(401)
    })
  })

  describe('logout', () => {
    test('should clear access cookie and return success message', () => {
      controller.logout(req, res)

      expect(res.clearCookie).toHaveBeenCalledWith('access_cookie')
      expect(res.json).toHaveBeenCalledWith({ message: 'Logout Successful' })
    })
  })

  describe('clear', () => {
    test('should clear all users', () => {
      controller.clear(req, res)

      expect(mockModel.clear).toHaveBeenCalledTimes(1)
      expect(res.send).toHaveBeenCalledWith(200)
    })
  })
})