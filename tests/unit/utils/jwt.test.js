import { describe, test, expect } from '@jest/globals'
import { newToken, validateToken } from '../../../src/utils/jwt.js'

describe('JWT Utilities', () => {
  const mockUser = {
    id: 'user123',
    email: 'test@example.com',
    user_name: 'testuser'
  }

  describe('newToken', () => {
    test('should generate a valid JWT token', () => {
      const token = newToken(mockUser)
      
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3) // JWT has 3 parts separated by dots
    })

    test('should include user data in token payload', () => {
      const token = newToken(mockUser)
      const decoded = validateToken(token)
      
      expect(decoded.id).toBe(mockUser.id)
      expect(decoded.email).toBe(mockUser.email)
      expect(decoded.user_name).toBe(mockUser.user_name)
      expect(decoded.exp).toBeDefined() // Should have expiration
      expect(decoded.iat).toBeDefined() // Should have issued at
    })
  })

  describe('validateToken', () => {
    test('should validate a valid token', () => {
      const token = newToken(mockUser)
      const decoded = validateToken(token)
      
      expect(decoded).toBeDefined()
      expect(decoded.id).toBe(mockUser.id)
      expect(decoded.email).toBe(mockUser.email)
      expect(decoded.user_name).toBe(mockUser.user_name)
    })

    test('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here'
      
      expect(() => {
        validateToken(invalidToken)
      }).toThrow()
    })

    test('should throw error for malformed token', () => {
      const malformedToken = 'not-a-jwt-token'
      
      expect(() => {
        validateToken(malformedToken)
      }).toThrow()
    })

    test('should throw error for empty token', () => {
      expect(() => {
        validateToken('')
      }).toThrow()
    })

    test('should throw error for null token', () => {
      expect(() => {
        validateToken(null)
      }).toThrow()
    })

    test('should throw error for undefined token', () => {
      expect(() => {
        validateToken(undefined)
      }).toThrow()
    })
  })
})