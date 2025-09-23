import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { errHandler } from '../../../src/middlewares/err.js'
import AppError from '../../../src/utils/AppError.js'

describe('Error Handler Middleware', () => {
  let req, res, next
  const originalEnv = process.env.NODE_ENV

  beforeEach(() => {
    req = {}
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    next = jest.fn()
  })

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
  })

  test('should handle AppError with custom status code', () => {
    const error = new AppError('Custom error message', 409)
    
    errHandler(error, req, res, next)
    
    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Custom error message',
      stack: undefined
    })
  })

  test('should handle generic Error with default 500 status', () => {
    const error = new Error('Generic error')
    
    errHandler(error, req, res, next)
    
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Generic error',
      stack: undefined
    })
  })

  test('should include stack trace in development mode', () => {
    process.env.NODE_ENV = 'dev'
    const error = new AppError('Test error', 400)
    
    errHandler(error, req, res, next)
    
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Test error',
      stack: error.stack
    })
  })

  test('should not include stack trace in production mode', () => {
    process.env.NODE_ENV = 'production'
    const error = new AppError('Test error', 400)
    
    errHandler(error, req, res, next)
    
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Test error',
      stack: undefined
    })
  })

  test('should handle 4xx status codes as fail', () => {
    const error = new AppError('Bad request', 400)
    
    errHandler(error, req, res, next)
    
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Bad request',
      stack: undefined
    })
  })

  test('should handle 5xx status codes as error', () => {
    const error = new AppError('Server error', 500)
    
    errHandler(error, req, res, next)
    
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Server error',
      stack: undefined
    })
  })

  test('should handle error without statusCode property', () => {
    const error = { message: 'Error without statusCode' }
    
    errHandler(error, req, res, next)
    
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Error without statusCode',
      stack: undefined
    })
  })

  test('should handle error without status property', () => {
    const error = { 
      message: 'Error without status',
      statusCode: 422
    }
    
    errHandler(error, req, res, next)
    
    expect(res.status).toHaveBeenCalledWith(422)
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Error without status',
      stack: undefined
    })
  })
})