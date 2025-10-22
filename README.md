# User Authentication System

A robust Node.js authentication system built with Express.js, featuring user registration, login, JWT-based authentication, and a clean web interface.

## 🚀 Features

- **User Registration & Login**: Secure user authentication with email/username support
- **JWT Authentication**: Token-based authentication with HTTP-only cookies and refresh tokens
- **Password Security**: bcrypt hashing for secure password storage
- **Password Reset**: Email-based password reset functionality with secure reset tokens
- **Refresh Tokens**: Automatic token refresh with 7-day expiry for seamless user experience
- **Input Validation**: Comprehensive validation using Zod schemas
- **Error Handling**: Centralized error handling with detailed logging
- **Responsive UI**: Clean EJS templates with modern styling
- **Local & MongoDB**: Support for both JSON-based local database and MongoDB
- **Development Tools**: ESLint configuration and hot reload support

## 📦 Tech Stack

- **Backend**: Node.js, Express.js
- **Authentication**: JWT (JSON Web Tokens), bcrypt, Refresh Tokens
- **Validation**: Zod
- **Database**: db-local (JSON-based) & MongoDB
- **Templating**: EJS
- **Email**: Nodemailer for password reset emails
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
   PORT=3030
   SALT_ROUNDS=10
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
   NODE_ENV=development
   URI_MONGODB=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   EMAIL_SENDER_USER=your_email@gmail.com
   EMAIL_SENDER_PASSW=your_app_password
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
│   │       │   ├── users.dblocal.js    # User database model (local JSON)
│   │       │   └── users.mongo.js      # User database model (MongoDB)
│   │       ├── users.controllers.js     # User controllers
│   │       ├── users.routes.js         # User API routes
│   │       └── users.schemas.js        # Zod validation schemas
│   ├── config/
│   │   └── config.js                   # Environment configuration
│   ├── middlewares/
│   │   ├── auth.js                     # JWT authentication & refresh middleware
│   │   └── err.js                      # Error handling middleware
│   ├── utils/
│   │   ├── AppError.js                 # Custom error class
│   │   └── jwt.js                      # JWT utilities
│   └── app.js                          # Main application file
├── views/
│   ├── index.ejs                       # Login/Register page
│   ├── protected.ejs                   # Protected dashboard
│   ├── reset.ejs                       # Password reset request page
│   ├── change-password.ejs             # Change password page
│   └── newPassword.ejs                 # New password form
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
| `POST` | `/users/refresh` | Refresh access token | - |
| `POST` | `/users/logout` | User logout | - |
| `POST` | `/users/reqNewPassword` | Request password reset | `{ email }` |
| `PUT` | `/users/newPassword` | Update password with reset token | `{ newPassword }` |

### User Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/users` | Get all users | ✅ |
| `DELETE` | `/users` | Delete all users | ✅ |

### Pages

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Home/Login page |
| `GET` | `/home/protected` | Protected dashboard |
| `GET` | `/home/reset` | Password reset request page |
| `GET` | `/home/new_passw/:token` | New password form with reset token |

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
| `PORT` | Server port | `3030` |
| `SALT_ROUNDS` | bcrypt salt rounds | `10` |
| `JWT_SECRET` | JWT access token signing secret | Required |
| `JWT_REFRESH_SECRET` | JWT refresh token signing secret | Required |
| `NODE_ENV` | Environment mode | `development` |
| `URI_MONGODB` | MongoDB connection string | Optional |
| `EMAIL_SENDER_USER` | Gmail address for sending reset emails | Required for password reset |
| `EMAIL_SENDER_PASSW` | Gmail app password | Required for password reset |

### Password Requirements

- Minimum 8 characters
- At least one letter
- At least one number

### JWT Configuration

- **Access Token Expiration**: 15 minutes
- **Refresh Token Expiration**: 7 days
- **Storage**: HTTP-only cookies (secure, sameSite: strict)
- **Security**: Separate secrets for access and refresh tokens

## 🛡️ Security Features

- **Password Hashing**: bcrypt with configurable salt rounds
- **JWT Security**: HTTP-only cookies with strict SameSite policy prevent XSS/CSRF attacks
- **Refresh Tokens**: Separate refresh token mechanism with longer expiry for secure token rotation
- **Token Refresh Middleware**: Automatic access token refresh on expiry using refresh tokens
- **Input Validation**: Comprehensive Zod schemas for all user inputs
- **Error Handling**: Secure error responses without exposing sensitive data
- **HTTPS Security**: Secure cookie flag enforced in production
- **Password Reset**: Secure email-based reset with time-limited tokens
- **Database Models**: Isolation between local and MongoDB implementations

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
- [x] Password reset functionality
- [x] Refresh token implementation
- [ ] Email verification on registration
- [ ] Role-based access control (RBAC)
- [ ] Rate limiting on authentication endpoints
- [ ] OAuth integration (Google, GitHub)
- [ ] API documentation with Swagger
- [ ] Unit and integration tests
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Two-factor authentication (2FA)

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

Built with ❤️ using Node.js and Express.js