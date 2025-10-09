# User Authentication System

A robust Node.js authentication system built with Express.js, featuring user registration, login, JWT-based authentication, and a clean web interface.

## 🚀 Features

- **User Registration & Login**: Secure user authentication with email/username support
- **JWT Authentication**: Token-based authentication with HTTP-only cookies
- **Password Security**: bcrypt hashing for secure password storage
- **Input Validation**: Comprehensive validation using Zod schemas
- **Error Handling**: Centralized error handling with detailed logging
- **Responsive UI**: Clean EJS templates with modern styling
- **Local Database**: JSON-based local database using db-local
- **Development Tools**: ESLint configuration and hot reload support

## 📦 Tech Stack

- **Backend**: Node.js, Express.js
- **Authentication**: JWT (JSON Web Tokens), bcrypt
- **Validation**: Zod
- **Database**: db-local (JSON-based)
- **Templating**: EJS
- **Development**: ESLint, pnpm
- **Testing**: HTTP files for API testing

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd user_auth
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   SALT_ROUNDS=10
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   NODE_ENV=development
   ```

4. **Start the application**:
   ```bash
   # Development mode (with hot reload)
   pnpm run dev
   
   # Production mode
   pnpm run start
   ```

## 📁 Project Structure

```
user_auth/
├── src/
│   ├── api/
│   │   ├── home/
│   │   │   └── home.routes.js          # Home page routes
│   │   └── users/
│   │       ├── models/
│   │       │   └── users.dblocal.js    # User database model
│   │       ├── users.controllers.js     # User controllers
│   │       ├── users.routes.js         # User API routes
│   │       └── users.schemas.js        # Zod validation schemas
│   ├── config/
│   │   └── config.js                   # Environment configuration
│   ├── middlewares/
│   │   ├── auth.js                     # JWT authentication middleware
│   │   └── err.js                      # Error handling middleware
│   ├── utils/
│   │   ├── AppError.js                 # Custom error class
│   │   └── jwt.js                      # JWT utilities
│   └── app.js                          # Main application file
├── views/
│   ├── index.ejs                       # Login/Register page
│   └── protected.ejs                   # Protected dashboard
├── test/
│   └── test.http                       # HTTP test requests
├── db/
│   └── User.json                       # Local JSON database
└── package.json
```

## 🔐 API Endpoints

### Authentication

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/users/register` | Register new user | `{ email, user_name, password }` |
| `POST` | `/users/login` | User login | `{ credential, password }` |
| `POST` | `/users/logout` | User logout | - |

### User Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/users` | Get all users | ✅ |
| `DELETE` | `/users` | Delete all users | ✅ |

### Pages

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/home` | Home/Login page |
| `GET` | `/home/protected` | Protected dashboard |

## 🧪 Testing

Use the provided HTTP test file for API testing:

```bash
# Located at: test/test.http
# Use VS Code REST Client extension or similar tools
```

### Example Requests

**Register a new user**:
```http
POST http://localhost:3000/users/register
Content-Type: application/json

{
    "email": "user@example.com",
    "user_name": "username",
    "password": "password123"
}
```

**Login**:
```http
POST http://localhost:3000/users/login
Content-Type: application/json

{
    "credential": "user@example.com",
    "password": "password123"
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `SALT_ROUNDS` | bcrypt salt rounds | `10` |
| `JWT_SECRET` | JWT signing secret | Required |
| `NODE_ENV` | Environment mode | `development` |

### Password Requirements

- Minimum 8 characters
- At least one letter
- At least one number

### JWT Configuration

- **Expiration**: 1 hour
- **Storage**: HTTP-only cookies
- **Security**: Signed with secret key

## 🛡️ Security Features

- **Password Hashing**: bcrypt with configurable salt rounds
- **JWT Security**: HTTP-only cookies prevent XSS attacks
- **Input Validation**: Comprehensive Zod schemas
- **Error Handling**: Secure error responses without sensitive data leakage
- **CORS Protection**: Configurable cross-origin policies

## 🚦 Development

### Available Scripts

```bash
# Development with hot reload
pnpm run dev

# Production server
pnpm run start

# Linting
pnpm run lint

# Testing
pnpm test
```

### Code Style

This project uses ESLint with Standard configuration for consistent code formatting.

## 📝 Error Handling

The application features comprehensive error handling:

- **Validation Errors**: 400 status with detailed field errors
- **Authentication Errors**: 401 status for invalid credentials
- **Authorization Errors**: 403 status for insufficient permissions
- **Not Found Errors**: 404 status for missing resources
- **Server Errors**: 500 status for internal errors

Development mode includes detailed error logging and stack traces.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🔮 Future Enhancements

- [x] Database migration to PostgreSQL/MongoDB
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Role-based access control (RBAC)
- [ ] Rate limiting
- [ ] OAuth integration (Google, GitHub)
- [ ] API documentation with Swagger
- [ ] Unit and integration tests
- [ ] Docker containerization
- [ ] CI/CD pipeline

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

Built with ❤️ using Node.js and Express.js