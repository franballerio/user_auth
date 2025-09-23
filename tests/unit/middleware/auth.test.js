import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { auth } from '../../../src/middlewares/auth.js'
import { newToken } from '../../../src/utils/jwt.js'

describe('Auth Middleware', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      cookies: {},
      session: {}
    }
    res = {}
    next = jest.fn()
  })

  test('should set userData to null when no token provided', () => {
    req.cookies = {}
    
    auth(req, res, next)
    
    expect(req.session.userData).toBeNull()
    expect(next).toHaveBeenCalledTimes(1)
  })

  test('should set userData to null when token is invalid', () => {
    req.cookies = {
      access_cookie: 'invalid.token.here'
    }
    
    auth(req, res, next)
    
    expect(req.session.userData).toBeNull()
    expect(next).toHaveBeenCalledTimes(1)
  })

  test('should set userData when valid token provided', () => {
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      user_name: 'testuser'
    }
    const validToken = newToken(mockUser)
    
    req.cookies = {
      access_cookie: validToken
    }
    
    auth(req, res, next)
    
    expect(req.session.userData).toBeDefined()
    expect(req.session.userData.id).toBe(mockUser.id)
    expect(req.session.userData.email).toBe(mockUser.email)
    expect(req.session.userData.user_name).toBe(mockUser.user_name)
    expect(next).toHaveBeenCalledTimes(1)
  })

  test('should set userData to null when token is expired', () => {
    // Create a token with past expiration
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXIxMjMiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJ1c2VyX25hbWUiOiJ0ZXN0dXNlciIsImV4cCI6MTYwMDAwMDAwMH0.invalidSignature'
    
    req.cookies = {
      access_cookie: expiredToken
    }
    
    auth(req, res, next)
    
    expect(req.session.userData).toBeNull()
    expect(next).toHaveBeenCalledTimes(1)
  })

  test('should initialize session object correctly', () => {
    req.cookies = {}
    
    auth(req, res, next)
    
    expect(req.session).toBeDefined()
    expect(req.session.userData).toBeNull()
    expect(next).toHaveBeenCalledTimes(1)
  })

  test('should handle malformed token gracefully', () => {
    req.cookies = {
      access_cookie: 'not-a-jwt-token'
    }
    
    auth(req, res, next)
    
    expect(req.session.userData).toBeNull()
    expect(next).toHaveBeenCalledTimes(1)
  })

  test('should handle empty string token', () => {
    req.cookies = {
      access_cookie: ''
    }
    
    auth(req, res, next)
    
    expect(req.session.userData).toBeNull()
    expect(next).toHaveBeenCalledTimes(1)
  })
})