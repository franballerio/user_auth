import { describe, test, expect } from '@jest/globals'
import AppError from '../../../src/utils/AppError.js'

describe('AppError', () => {
  test('should create error with message and status code', () => {
    const message = 'Test error message'
    const statusCode = 400
    
    const error = new AppError(message, statusCode)
    
    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(AppError)
    expect(error.message).toBe(message)
    expect(error.statusCode).toBe(statusCode)
    expect(error.stack).toBeDefined()
  })

  test('should set status to "fail" for 4xx status codes', () => {
    const error400 = new AppError('Bad Request', 400)
    const error404 = new AppError('Not Found', 404)
    const error422 = new AppError('Unprocessable Entity', 422)
    
    expect(error400.status).toBe('fail')
    expect(error404.status).toBe('fail')
    expect(error422.status).toBe('fail')
  })

  test('should set status to "error" for 5xx status codes', () => {
    const error500 = new AppError('Internal Server Error', 500)
    const error502 = new AppError('Bad Gateway', 502)
    const error503 = new AppError('Service Unavailable', 503)
    
    expect(error500.status).toBe('error')
    expect(error502.status).toBe('error')
    expect(error503.status).toBe('error')
  })

  test('should set status to "error" for other status codes', () => {
    const error200 = new AppError('OK', 200)
    const error300 = new AppError('Redirect', 300)
    
    expect(error200.status).toBe('error')
    expect(error300.status).toBe('error')
  })

  test('should capture stack trace correctly', () => {
    const error = new AppError('Test error', 400)
    
    expect(error.stack).toBeDefined()
    expect(error.stack).toContain('AppError')
    expect(error.stack).toContain('Test error')
  })

  test('should handle empty message', () => {
    const error = new AppError('', 400)
    
    expect(error.message).toBe('')
    expect(error.statusCode).toBe(400)
    expect(error.status).toBe('fail')
  })

  test('should handle special characters in message', () => {
    const message = 'Error with special chars: àáâãäåæçèéêë'
    const error = new AppError(message, 400)
    
    expect(error.message).toBe(message)
  })
})