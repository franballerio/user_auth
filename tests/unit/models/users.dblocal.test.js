import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { UserDB } from '../../../src/api/users/models/users.dblocal.js'
import bcrypt from 'bcrypt'

describe('UserDB Model', () => {
  beforeEach(async () => {
    // Clear database before each test
    UserDB.clear()
  })

  afterEach(async () => {
    // Clean up after each test
    UserDB.clear()
  })

  describe('create', () => {
    test('should create a new user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        user_name: 'testuser',
        password: 'password123'
      }

      const result = await UserDB.create(userData)

      expect(result).toBeDefined()
      expect(result._id).toBeDefined()
      expect(result.email).toBe(userData.email)
      expect(result.user_name).toBe(userData.user_name)
      expect(result.password).toBeDefined()
      expect(result.password).not.toBe(userData.password) // Should be hashed
      
      // Verify password is properly hashed
      const isValidPassword = await bcrypt.compare(userData.password, result.password)
      expect(isValidPassword).toBe(true)
    })

    test('should throw error when creating user with existing email', async () => {
      const userData = {
        email: 'test@example.com',
        user_name: 'testuser',
        password: 'password123'
      }

      // Create first user
      await UserDB.create(userData)

      // Try to create user with same email
      const duplicateEmailData = {
        email: 'test@example.com',
        user_name: 'different_user',
        password: 'password456'
      }

      await expect(UserDB.create(duplicateEmailData)).rejects.toThrow('Already registered')
    })

    test('should throw error when creating user with existing username', async () => {
      const userData = {
        email: 'test@example.com',
        user_name: 'testuser',
        password: 'password123'
      }

      // Create first user
      await UserDB.create(userData)

      // Try to create user with same username
      const duplicateUsernameData = {
        email: 'different@example.com',
        user_name: 'testuser',
        password: 'password456'
      }

      await expect(UserDB.create(duplicateUsernameData)).rejects.toThrow('Already registered')
    })
  })

  describe('login', () => {
    let testUser

    beforeEach(async () => {
      const userData = {
        email: 'test@example.com',
        user_name: 'testuser',
        password: 'password123'
      }
      testUser = await UserDB.create(userData)
    })

    test('should login with valid email and password', async () => {
      const loginData = {
        userORemail: 'test@example.com',
        password: 'password123'
      }

      const result = await UserDB.login(loginData)

      expect(result).toBeDefined()
      expect(result._id).toBe(testUser._id)
      expect(result.email).toBe(testUser.email)
      expect(result.user_name).toBe(testUser.user_name)
      expect(result.password).toBeUndefined() // Password should not be returned
    })

    test('should login with valid username and password', async () => {
      const loginData = {
        userORemail: 'testuser',
        password: 'password123'
      }

      const result = await UserDB.login(loginData)

      expect(result).toBeDefined()
      expect(result._id).toBe(testUser._id)
      expect(result.email).toBe(testUser.email)
      expect(result.user_name).toBe(testUser.user_name)
      expect(result.password).toBeUndefined()
    })

    test('should throw error with invalid email', async () => {
      const loginData = {
        userORemail: 'nonexistent@example.com',
        password: 'password123'
      }

      await expect(UserDB.login(loginData)).rejects.toThrow('Invalid Credentials')
    })

    test('should throw error with invalid username', async () => {
      const loginData = {
        userORemail: 'nonexistentuser',
        password: 'password123'
      }

      await expect(UserDB.login(loginData)).rejects.toThrow('Invalid Credentials')
    })

    test('should throw error with invalid password', async () => {
      const loginData = {
        userORemail: 'test@example.com',
        password: 'wrongpassword'
      }

      await expect(UserDB.login(loginData)).rejects.toThrow('Invalid Credentials')
    })
  })

  describe('users', () => {
    test('should return empty array when no users exist', async () => {
      const result = await UserDB.users()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })

    test('should return all users when users exist', async () => {
      const userData1 = {
        email: 'test1@example.com',
        user_name: 'testuser1',
        password: 'password123'
      }
      const userData2 = {
        email: 'test2@example.com',
        user_name: 'testuser2',
        password: 'password456'
      }

      await UserDB.create(userData1)
      await UserDB.create(userData2)

      const result = await UserDB.users()

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(2)
      expect(result.some(user => user.email === userData1.email)).toBe(true)
      expect(result.some(user => user.email === userData2.email)).toBe(true)
    })
  })

  describe('clear', () => {
    test('should remove all users from database', async () => {
      const userData = {
        email: 'test@example.com',
        user_name: 'testuser',
        password: 'password123'
      }

      await UserDB.create(userData)
      
      // Verify user exists
      let users = await UserDB.users()
      expect(users.length).toBe(1)

      // Clear database
      UserDB.clear()

      // Verify no users exist
      users = await UserDB.users()
      expect(users.length).toBe(0)
    })
  })
})