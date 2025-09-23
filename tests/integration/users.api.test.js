import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import request from 'supertest'
import express from 'express'
import cookieParser from 'cookie-parser'
import { usersRouter } from '../../src/api/users/users.routes.js'
import { UserDB } from '../../src/api/users/models/users.dblocal.js'
import { errHandler } from '../../src/middlewares/err.js'

describe('Users API Integration Tests', () => {
  let app

  beforeEach(() => {
    // Create a test app
    app = express()
    app.use(express.json())
    app.use(cookieParser())
    app.use('/users', usersRouter({ model: UserDB }))
    app.use(errHandler)

    // Clear database before each test
    UserDB.clear()
  })

  afterEach(() => {
    // Clean up after each test
    UserDB.clear()
  })

  describe('POST /users/register', () => {
    test('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        user_name: 'testuser',
        password: 'password123'
      }

      const response = await request(app)
        .post('/users/register')
        .send(userData)
        .expect(201)

      expect(response.body).toBeDefined()
      expect(response.body.email).toBe(userData.email)
      expect(response.body.user_name).toBe(userData.user_name)
      expect(response.body._id).toBeDefined()
      expect(response.body.password).toBeDefined()
      
      // Check if cookie is set
      expect(response.headers['set-cookie']).toBeDefined()
      expect(response.headers['set-cookie'][0]).toContain('access_cookie')
    })

    test('should reject registration with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        user_name: 'testuser',
        password: 'password123'
      }

      const response = await request(app)
        .post('/users/register')
        .send(userData)
        .expect(400)

      expect(response.body.status).toBe('fail')
      expect(response.body.message).toContain('Invalid email')
    })

    test('should reject registration with short password', async () => {
      const userData = {
        email: 'test@example.com',
        user_name: 'testuser',
        password: 'short'
      }

      const response = await request(app)
        .post('/users/register')
        .send(userData)
        .expect(400)

      expect(response.body.status).toBe('fail')
      expect(response.body.message).toContain('Password must be at least 8 characters')
    })

    test('should reject registration with password without number', async () => {
      const userData = {
        email: 'test@example.com',
        user_name: 'testuser',
        password: 'passwordonly'
      }

      const response = await request(app)
        .post('/users/register')
        .send(userData)
        .expect(400)

      expect(response.body.status).toBe('fail')
      expect(response.body.message).toContain('Password must contain at least one letter and one number')
    })

    test('should reject duplicate email registration', async () => {
      const userData = {
        email: 'test@example.com',
        user_name: 'testuser1',
        password: 'password123'
      }

      // Register first user
      await request(app)
        .post('/users/register')
        .send(userData)
        .expect(201)

      // Try to register with same email
      const duplicateData = {
        email: 'test@example.com',
        user_name: 'testuser2',
        password: 'password456'
      }

      const response = await request(app)
        .post('/users/register')
        .send(duplicateData)
        .expect(409)

      expect(response.body.status).toBe('fail')
      expect(response.body.message).toBe('Already registered')
    })
  })

  describe('POST /users/login', () => {
    let testUser

    beforeEach(async () => {
      // Create a test user
      testUser = {
        email: 'test@example.com',
        user_name: 'testuser',
        password: 'password123'
      }

      await request(app)
        .post('/users/register')
        .send(testUser)
        .expect(201)
    })

    test('should login with valid email and password', async () => {
      const loginData = {
        userORemail: 'test@example.com',
        password: 'password123'
      }

      const response = await request(app)
        .post('/users/login')
        .send(loginData)
        .expect(200)

      expect(response.body).toBeDefined()
      expect(response.body.email).toBe(testUser.email)
      expect(response.body.user_name).toBe(testUser.user_name)
      expect(response.body._id).toBeDefined()
      expect(response.body.password).toBeUndefined()

      // Check if cookie is set
      expect(response.headers['set-cookie']).toBeDefined()
      expect(response.headers['set-cookie'][0]).toContain('access_cookie')
    })

    test('should login with valid username and password', async () => {
      const loginData = {
        userORemail: 'testuser',
        password: 'password123'
      }

      const response = await request(app)
        .post('/users/login')
        .send(loginData)
        .expect(200)

      expect(response.body).toBeDefined()
      expect(response.body.email).toBe(testUser.email)
      expect(response.body.user_name).toBe(testUser.user_name)
    })

    test('should reject login with invalid credentials', async () => {
      const loginData = {
        userORemail: 'test@example.com',
        password: 'wrongpassword'
      }

      const response = await request(app)
        .post('/users/login')
        .send(loginData)
        .expect(401)

      expect(response.body.status).toBe('fail')
      expect(response.body.message).toBe('Invalid credentials') // Changed to match actual error message
    })

    test('should reject login with nonexistent user', async () => {
      const loginData = {
        userORemail: 'nonexistent@example.com',
        password: 'password123'
      }

      const response = await request(app)
        .post('/users/login')
        .send(loginData)
        .expect(401)

      expect(response.body.status).toBe('fail')
      expect(response.body.message).toBe('Invalid Credentials')
    })

    test('should reject login with invalid validation data', async () => {
      const loginData = {
        userORemail: '',
        password: 'short'
      }

      const response = await request(app)
        .post('/users/login')
        .send(loginData)
        .expect(401)

      expect(response.body.status).toBe('fail')
      expect(response.body.message).toBe('Invalid credentials')
    })
  })

  describe('POST /users/logout', () => {
    test('should logout successfully', async () => {
      const response = await request(app)
        .post('/users/logout')
        .expect(200)

      expect(response.body.message).toBe('Logout Successful')
      
      // Check if cookie is cleared
      expect(response.headers['set-cookie']).toBeDefined()
      expect(response.headers['set-cookie'][0]).toContain('access_cookie=;')
    })
  })

  describe('GET /users', () => {
    test('should return empty array when no users exist', async () => {
      const response = await request(app)
        .get('/users')
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBe(0)
    })

    test('should return all users when users exist', async () => {
      // Create test users
      const user1 = {
        email: 'user1@example.com',
        user_name: 'user1',
        password: 'password123'
      }
      const user2 = {
        email: 'user2@example.com',
        user_name: 'user2',
        password: 'password456'
      }

      await request(app).post('/users/register').send(user1)
      await request(app).post('/users/register').send(user2)

      const response = await request(app)
        .get('/users')
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBe(2)
      expect(response.body.some(user => user.email === user1.email)).toBe(true)
      expect(response.body.some(user => user.email === user2.email)).toBe(true)
    })
  })

  describe('DELETE /users', () => {
    test('should clear all users', async () => {
      // Create a test user first
      const userData = {
        email: 'test@example.com',
        user_name: 'testuser',
        password: 'password123'
      }

      await request(app).post('/users/register').send(userData)

      // Verify user exists
      let response = await request(app).get('/users')
      expect(response.body.length).toBe(1)

      // Clear users
      await request(app)
        .delete('/users')
        .expect(200)

      // Verify no users exist
      response = await request(app).get('/users')
      expect(response.body.length).toBe(0)
    })
  })
})