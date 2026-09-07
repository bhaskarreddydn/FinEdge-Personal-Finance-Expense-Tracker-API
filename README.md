# FinEdge — Personal Finance & Expense Tracker API

A modular, lightweight RESTful API for personal finance and expense tracking built with **Node.js**, **Express.js**, **JSON file persistence** (`fs/promises`), and **JWT authentication**.

This project is organized as a collaborative 4-member system architecture. This repository contains the **complete application foundation and Member 1 (User / Authentication & Core Infrastructure)** implementation.

---

## 🛠 Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Data Persistence**: Asynchronous JSON File Storage via `fs/promises` (No external database required)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`)
- **Password Security**: `bcryptjs` (salt + hash, sensitive fields never exposed)
- **Configuration**: `dotenv`
- **Testing**: Jest + Supertest
- **Dev Server**: Nodemon

---

## 👥 Group Project Architecture & Ownership

| Member | Responsibility Area | Status | Files / Modules |
| :--- | :--- | :--- | :--- |
| **Member 1 (Current)** | **Application Foundation, Architecture, User Registration, Login, JWT Auth, Global Error Handling, Request Logger, JSON Persistence, Testing** | **Implemented & Tested** | `src/app.js`, `src/server.js`, `src/routes/userRoutes.js`, `src/controllers/userController.js`, `src/services/userService.js`, `src/models/userModel.js`, `src/middleware/authMiddleware.js`, `src/middleware/logger.js`, `src/middleware/errorHandler.js`, `src/middleware/notFoundHandler.js`, `src/utils/AppError.js`, `src/utils/response.js`, `src/controllers/demoController.js`, `src/routes/demoRoutes.js` |
| **Member 2** | Transactions CRUD, Category Assignment, User Transaction Isolation | *Skeleton Placeholder Ready* | `src/routes/transactionRoutes.js`, `src/controllers/transactionController.js`, `src/services/transactionService.js`, `src/models/transactionModel.js`, `src/data/transactions.json` |
| **Member 3** | Input Validation & Schema Middleware | *Skeleton Placeholder Ready* | `src/middleware/validator.js` |
| **Member 4** | Financial Summary, Analytics, Monthly Trends, AI Insights | *Skeleton Placeholder Ready* | `src/routes/summaryRoutes.js`, `src/utils/analytics.js`, `src/utils/aiHelper.js` |

---

## 📁 Project Structure

```text
finedge/
│
├── package.json
├── package-lock.json
├── .env
├── .env.example
├── .gitignore
├── README.md
├── postman_collection.json
│
├── src/
│   ├── app.js                          # Express app configuration & middleware pipeline
│   ├── server.js                       # HTTP server listener
│   │
│   ├── routes/
│   │   ├── userRoutes.js               # POST /users, POST /users/login
│   │   ├── demoRoutes.js               # GET /demo/protected, GET /demo/error
│   │   ├── transactionRoutes.js        # [Member 2 Placeholder]
│   │   └── summaryRoutes.js            # [Member 4 Placeholder]
│   │
│   ├── controllers/
│   │   ├── userController.js           # Handles user registration and login
│   │   ├── demoController.js           # Demonstrates auth verification and AppError
│   │   └── transactionController.js    # [Member 2 Placeholder]
│   │
│   ├── services/
│   │   ├── userService.js              # Business logic: hashing, JWT issuance, validation
│   │   └── transactionService.js       # [Member 2 Placeholder]
│   │
│   ├── models/
│   │   ├── userModel.js                # Async fs/promises persistence for users
│   │   └── transactionModel.js         # [Member 2 Placeholder]
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js           # Bearer JWT verification, populates req.user
│   │   ├── logger.js                   # Request logging (timestamp, method, url, latency)
│   │   ├── errorHandler.js             # Central Express (err, req, res, next) handler
│   │   ├── notFoundHandler.js          # 404 Route Not Found handler
│   │   └── validator.js                # [Member 3 Placeholder]
│   │
│   ├── utils/
│   │   ├── AppError.js                 # Reusable custom application error class
│   │   ├── response.js                 # Standardized success/error JSON response builders
│   │   ├── analytics.js                # [Member 4 Placeholder]
│   │   └── aiHelper.js                 # [Member 4 Placeholder]
│   │
│   └── data/
│       ├── users.json                  # JSON file persistence for users
│       └── transactions.json           # JSON file persistence for transactions
│
└── tests/
    ├── health.test.js                  # Health check and 404 tests
    ├── auth.test.js                    # Registration, login, duplicate check tests
    └── demo.test.js                    # Protected auth and error handler tests
```

---

## ⚙️ Installation & Setup

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/bhaskarreddydn/FinEdge-Personal-Finance-Expense-Tracker-API.git
cd FinEdge-Personal-Finance-Expense-Tracker-API
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory (or copy from `.env.example`):

```bash
cp .env.example .env
```

Parameters in `.env`:
- `PORT`: Server port (default: `5000`)
- `JWT_SECRET`: Secret key used for signing and verifying JSON Web Tokens
- `JWT_EXPIRES_IN`: Expiration duration for tokens (e.g., `1h`, `7d`)
- `NODE_ENV`: Application environment (`development` or `production`)

Example `.env`:
```env
PORT=5000
JWT_SECRET=finedge_development_secret_key_2026_super_secure
JWT_EXPIRES_IN=1h
NODE_ENV=development
```

---

## 🚀 Running the Application

### Development Mode (with automatic restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The API will start at:
```text
http://localhost:5000
```

---

## 🧪 Running Tests

A comprehensive test suite built with **Jest** and **Supertest** verifies health checks, user registration, duplicate email handling, login validation, token issuance, protected routes, and centralized error handling:

```bash
npm test
```

---

## 📡 API Contract & Standard Response Structure

All endpoints in FinEdge conform to a unified JSON response contract.

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional descriptive message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description"
  }
}
```

---

## 📖 API Endpoints Implemented (Member 1)

### 1. Health Check
- **Endpoint**: `GET /health`
- **Access**: Public
- **Description**: Verifies that the API server is up and responsive.
- **Sample Response**:
  ```json
  {
    "success": true,
    "data": {
      "status": "OK"
    }
  }
  ```

---

### 2. User Registration
- **Endpoint**: `POST /users` (or `POST /api/users`)
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "Bhaskar Reddy",
    "email": "bhaskar@example.com",
    "password": "password123"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "user_1725682800000_abc123",
      "name": "Bhaskar Reddy",
      "email": "bhaskar@example.com",
      "createdAt": "2026-09-07T09:30:00.000Z"
    },
    "message": "User created successfully"
  }
  ```
- **Duplicate Email Response (409 Conflict)**:
  ```json
  {
    "success": false,
    "error": {
      "code": "USER_ALREADY_EXISTS",
      "message": "A user with this email already exists"
    }
  }
  ```

---

### 3. User Login
- **Endpoint**: `POST /users/login` (or `POST /api/users/login`)
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "bhaskar@example.com",
    "password": "password123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "tokenType": "Bearer",
      "expiresIn": "1h"
    },
    "message": "Login successful"
  }
  ```
- **Invalid Credentials Response (401 Unauthorized)**:
  ```json
  {
    "success": false,
    "error": {
      "code": "INVALID_CREDENTIALS",
      "message": "Invalid credentials"
    }
  }
  ```

---

### 4. Protected Demo Endpoint
- **Endpoint**: `GET /demo/protected` (or `GET /api/demo/protected`)
- **Access**: Private (Requires `Authorization: Bearer <accessToken>`)
- **Description**: Proves that `authMiddleware` intercepts the request, verifies the JWT, and extracts user identity into `req.user`.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "You accessed a protected route",
      "user": {
        "id": "user_1725682800000_abc123",
        "email": "bhaskar@example.com"
      }
    }
  }
  ```

---

### 5. Error Demonstration Endpoint
- **Endpoint**: `GET /demo/error` (or `GET /api/demo/error`)
- **Access**: Public
- **Description**: Demonstrates throwing an `AppError` and handling it automatically through the global error pipeline.
- **Response (400 Bad Request)**:
  ```json
  {
    "success": false,
    "error": {
      "code": "DEMO_ERROR",
      "message": "This is a demonstration error"
    }
  }
  ```

---

## 🔒 Architectural Contract for Team Members 2, 3, and 4

1. **User Identity Access**:
   All protected routes protected by `authMiddleware` automatically have access to:
   ```javascript
   req.user = {
     id: "user_xxx",
     email: "user@example.com"
   };
   ```
   Members 2 and 4 do **NOT** need to decode or parse JWT tokens manually. Simply consume `req.user.id` to scope transactions and summaries to the authenticated user.

2. **Consistent Error Throwing**:
   Throw `AppError` from controllers or services to return structured errors:
   ```javascript
   const AppError = require('../utils/AppError');

   throw new AppError("Transaction not found", 404, "TRANSACTION_NOT_FOUND");
   ```

3. **Standardized Responses**:
   Use `sendSuccess` or `sendError` from `src/utils/response.js`:
   ```javascript
   const { sendSuccess } = require('../utils/response');

   return sendSuccess(res, 200, transactionData, "Transaction retrieved successfully");
   ```