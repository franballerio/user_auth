# Test Documentation

This project includes comprehensive unit and integration tests for the user authentication system.

## Test Structure

```
tests/
├── setup.js                      # Global test configuration
├── unit/                         # Unit tests
│   ├── controllers/
│   │   └── users.controllers.test.js
│   ├── middleware/
│   │   ├── auth.test.js
│   │   └── err.test.js
│   ├── models/
│   │   └── users.dblocal.test.js
│   ├── schemas/
│   │   └── users.schemas.test.js
│   └── utils/
│       ├── AppError.test.js
│       └── jwt.test.js
└── integration/
    └── users.api.test.js
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

The current test suite achieves:
- **89.38%** statement coverage
- **88.23%** branch coverage  
- **92.85%** function coverage
- **90.74%** line coverage

## Test Categories

### Unit Tests

#### 1. UserDB Model Tests (`tests/unit/models/users.dblocal.test.js`)
Tests the database layer functionality:
- **create**: User creation with validation, duplicate prevention
- **login**: Authentication with email/username, password validation
- **users**: Retrieving all users
- **clear**: Database cleanup

#### 2. Controller Tests (`tests/unit/controllers/users.controllers.test.js`)
Tests the API controller logic:
- **register**: User registration endpoint logic
- **login**: User authentication endpoint logic
- **logout**: Session termination
- **users**: User listing
- **clear**: Database clearing

#### 3. Middleware Tests
- **auth.test.js**: JWT token validation and session management
- **err.test.js**: Error handling and response formatting

#### 4. Utility Tests
- **jwt.test.js**: JWT token generation and validation
- **AppError.test.js**: Custom error class functionality

#### 5. Schema Tests (`tests/unit/schemas/users.schemas.test.js`)
Tests Zod validation schemas:
- Registration data validation
- Login data validation
- Error message extraction

### Integration Tests

#### API Endpoint Tests (`tests/integration/users.api.test.js`)
Tests complete API workflows:
- **POST /users/register**: User registration with various scenarios
- **POST /users/login**: User authentication with different credentials
- **POST /users/logout**: Session termination
- **GET /users**: User listing
- **DELETE /users**: Database clearing

## Key Test Features

### 1. Environment Isolation
- Tests run in isolated `test` environment
- Separate database instances for each test
- Clean setup/teardown for each test case

### 2. Comprehensive Error Testing
- Invalid input validation
- Authentication failures
- Database constraint violations
- Malformed data handling

### 3. Security Testing
- Password hashing verification
- JWT token validation
- Authentication bypass prevention
- Input sanitization

### 4. Edge Cases
- Empty inputs
- Boundary value testing
- Malformed requests
- Network error simulation

## Test Data

Tests use predictable test data:
- **Email**: test@example.com, user1@example.com, etc.
- **Username**: testuser, testuser1, etc.
- **Password**: password123 (meets requirements)
- **Invalid passwords**: short, passwordonly, 12345678

## Mocking Strategy

- **Database**: Uses real database with cleanup
- **External dependencies**: Mocked where appropriate
- **HTTP requests**: Uses supertest for integration tests
- **JWT tokens**: Uses real implementation for security testing

## Continuous Integration

Tests are designed to run in CI/CD environments:
- No external dependencies
- Fast execution (< 3 seconds)
- Deterministic results
- Proper cleanup

## Adding New Tests

When adding new functionality:

1. **Unit tests**: Test individual functions/methods
2. **Integration tests**: Test complete workflows
3. **Error cases**: Test all error conditions
4. **Edge cases**: Test boundary conditions
5. **Security**: Test authentication/authorization

### Example Test Structure

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup test data
  })

  afterEach(() => {
    // Cleanup
  })

  describe('method name', () => {
    test('should handle normal case', () => {
      // Test implementation
    })

    test('should handle error case', () => {
      // Error test implementation
    })
  })
})
```