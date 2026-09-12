# FinEdge — Personal Finance & Expense Tracker API

A modular, lightweight RESTful API for personal finance and expense tracking built with **Node.js**, **Express.js**, **JSON file persistence** (`fs/promises`), and **JWT authentication**.

This project is organized as a collaborative 4-member system architecture developed by:
- **Member 1 (Bhaskar)**: Application Foundation, Architecture, User Registration & Auth, Financial Summary, Analytics, Postman Collection
- **Member 2 (Sanjana)**: Transactions CRUD, Category Assignment, User Transaction Isolation
- **Member 3 (Komathi)**: Input Validation, Custom Error Classes, Request Logging, CORS, Rate Limiting
- **Member 4 (Sangram)**: Comprehensive Automated Testing Suite across all endpoints and services

---

## 🛠 Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Data Persistence**: Asynchronous JSON File Storage via `fs/promises` (No external database required)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`)
- **Password Security**: `bcryptjs` (salt + hash, sensitive fields never exposed)
- **Configuration**: `dotenv`
- **Cross-Origin Requests**: `cors`
- **Rate Limiting**: `express-rate-limit`
- **Testing**: Jest + Supertest
- **Dev Server**: Nodemon

---

## 👥 Group Project Architecture & Ownership

| Member | Name | Responsibility Area | Status | Files / Modules |
| :--- | :--- | :--- | :--- | :--- |
| **Member 1** | **Bhaskar** | **Application Foundation, Architecture, User Auth, Financial Summary, Analytics, Postman Collection** | **Implemented & Tested** | `src/app.js`, `src/server.js`, `src/routes/userRoutes.js`, `src/controllers/userController.js`, `src/services/userService.js`, `src/models/userModel.js`, `src/routes/summaryRoutes.js`, `src/controllers/summaryController.js`, `src/services/summaryService.js`, `src/utils/analytics.js`, `src/utils/aiHelper.js`, `src/middleware/authMiddleware.js`, `src/middleware/logger.js`, `src/middleware/errorHandler.js`, `src/middleware/notFoundHandler.js`, `src/utils/AppError.js`, `src/utils/response.js`, `postman_collection.json`, `src/controllers/demoController.js`, `src/routes/demoRoutes.js` |
| **Member 2** | **Sanjana** | **Transactions CRUD, Category Assignment, User Transaction Isolation** | **Implemented & Tested** | `src/routes/transactionRoutes.js`, `src/controllers/transactionController.js`, `src/services/transactionService.js`, `src/models/transactionModel.js`, `src/data/transactions.json` |
| **Member 3** | **Komathi** | **Input Validation, Custom Error Classes, Request Logging, CORS, Rate Limiting** | **Implemented & Tested** | `src/middleware/validator.js`, `src/middleware/rateLimiter.js`, `src/middleware/corsOptions.js`, `src/middleware/logger.js`, `src/utils/errors.js` |
| **Member 4** | **Sangram** | **Comprehensive Automated Testing & QA Suite (All Module Test Cases)** | **Implemented & Tested** | `tests/health.test.js`, `tests/auth.test.js`, `tests/demo.test.js`, `tests/middleware.test.js`, `tests/transaction.test.js`, `tests/summary.test.js` |

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
│   │   ├── transactionRoutes.js        # Transaction CRUD routes (GET, POST, PATCH, DELETE)
│   │   └── summaryRoutes.js            # GET /summary
│   │
│   ├── controllers/
│   │   ├── userController.js           # Handles user registration and login
│   │   ├── demoController.js           # Demonstrates auth verification and AppError
│   │   ├── transactionController.js    # Handles transaction operations
│   │   └── summaryController.js        # Handles summary calculations
│   │
│   ├── services/
│   │   ├── userService.js              # User logic: password hashing, JWT issuance
│   │   ├── transactionService.js       # Transaction CRUD & query filtering
│   │   └── summaryService.js           # Aggregation of user transactions for summary
│   │
│   ├── models/
│   │   ├── userModel.js                # Async fs/promises persistence for users
│   │   └── transactionModel.js         # Async fs/promises persistence for transactions
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js           # Bearer JWT verification, populates req.user
│   │   ├── logger.js                   # Request logging (timestamp, method, url, status, latency, user)
│   │   ├── errorHandler.js             # Central Express (err, req, res, next) handler
│   │   ├── notFoundHandler.js          # 404 Route Not Found handler
│   │   ├── validator.js                # Input validation for users and transactions
│   │   ├── rateLimiter.js              # Configurable per-IP rate limiting
│   │   └── corsOptions.js              # Configurable CORS policy
│   │
│   ├── utils/
│   │   ├── AppError.js                 # Reusable custom application error class
│   │   ├── errors.js                   # Semantic error subclasses (Validation, NotFound, Conflict...)
│   │   ├── response.js                 # Standardized success/error JSON response builders
│   │   ├── analytics.js                # Financial metrics & balance calculation
│   │   └── aiHelper.js                 # AI Helper utility placeholder
│   │
│   └── data/
│       ├── users.json                  # JSON file persistence for users
│       └── transactions.json           # JSON file persistence for transactions
│
└── tests/
    ├── health.test.js                  # Health check and 404 tests
    ├── auth.test.js                    # Registration, login, duplicate check tests
    ├── demo.test.js                    # Protected auth and error handler tests
    ├── middleware.test.js              # Validation, error classes, CORS, rate limit tests
    ├── transaction.test.js             # Transaction CRUD and isolation tests
    └── summary.test.js                 # Summary calculation and filter tests
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
- `CORS_ORIGIN`: Comma-separated list of allowed origins, or `*` for any (Member 3)
- `RATE_LIMIT_WINDOW_MS`: Rate limit window in milliseconds (default: `900000`, i.e. 15 minutes) (Member 3)
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per IP per window (default: `100`) (Member 3)

Example `.env`:
```env
PORT=5000
JWT_SECRET=finedge_development_secret_key_2026_super_secure
JWT_EXPIRES_IN=1h
NODE_ENV=development
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

> **Note:** `.env` is gitignored, so every teammate must create their own. Without
> `JWT_SECRET` set, login returns `500` and the auth-dependent tests fail.

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

## 🛡 Middleware, Validation & Error Handling (Member 3: Komathi)

### Middleware execution order

Registration order in `src/app.js` is deliberate:

```
CORS  ->  express.json()  ->  logger  ->  rateLimiter  ->  routes  ->  notFoundHandler  ->  errorHandler
```

- `logger` is registered **before** `rateLimiter` so rejected (429) requests are still logged.
- `rateLimiter` is skipped when `NODE_ENV=test` so the test suite cannot exhaust the quota.
- `errorHandler` is last, as Express only routes errors to middleware registered after the throwing code.

### Custom error classes (`src/utils/errors.js`)

Each class fixes its status and error code, so call sites supply only the message.
All extend `AppError`, so the global error handler serialises them with no changes.

| Class | Status | `error.code` |
| :--- | :--- | :--- |
| `ValidationError` | 400 | `VALIDATION_ERROR` |
| `UnauthorizedError` | 401 | `UNAUTHORIZED` |
| `ForbiddenError` | 403 | `FORBIDDEN` |
| `NotFoundError` | 404 | `NOT_FOUND` |
| `ConflictError` | 409 | `CONFLICT` |
| `TooManyRequestsError` | 429 | `RATE_LIMIT_EXCEEDED` |

```javascript
const { NotFoundError, ValidationError } = require('../utils/errors');

throw new NotFoundError('Transaction');              // -> 404 "Transaction not found"
return next(new ValidationError('Amount must be greater than zero'));
```

### Transaction validation

Applied in `src/routes/transactionRoutes.js`, after `authMiddleware` so an
unauthenticated request returns `401` rather than a validation `400`.

| Middleware | Applied to |
| :--- | :--- |
| `validateCreateTransaction` | `POST /transactions` |
| `validateUpdateTransaction` | `PATCH /transactions/:id` |
| `validateTransactionQuery` | `GET /transactions` |

**Create rules** — `type`, `category`, `amount` and `date` are required; `description` optional.

| Field | Rule |
| :--- | :--- |
| `type` | Must be `income` or `expense` |
| `category` | Non-empty string |
| `amount` | Finite number **greater than zero**; numeric strings such as `"450"` are rejected so the persisted JSON keeps a consistent type |
| `date` | Strict `YYYY-MM-DD`, and must be a real calendar date |
| `description` | String, if present |

**Update rules** — every field is optional (PATCH is partial), but at least one
must be supplied and **unknown fields are rejected**. The update service merges
the request body into the stored record, so without this an arbitrary key such
as `{"hackedField":"evil"}` would be persisted onto the transaction.

**Query rules** — `type`, `category`, `startDate`, `endDate` are each validated
if supplied, and `startDate` may not be later than `endDate`.

> **Why the date format is strict:** the transaction service filters ranges with
> string comparison (`transaction.date >= filters.startDate`). That is only
> correct for zero-padded ISO dates, so a value like `09/04/2026` would be
> accepted and then filter silently and wrongly.

### Request logger

Logs on the response `finish` event, so the status, duration and the
authenticated user are all known by the time the line is written:

```
[2026-09-11T04:36:16.704Z] PATCH /transactions/txn_1789101376663 -> 200 (2ms) user=user_1789101376578_vn6a5b
[2026-09-11T04:35:52.370Z] GET /health -> 429 (0ms) user=anonymous
```

Public routes log as `anonymous`. Logging is wrapped in `try/catch` so a logging
fault can never break a request.

### CORS

Origins come from `CORS_ORIGIN` as a comma-separated list; unset or `*` allows
any origin, which suits local development and grading.

### Rate limiting

Defaults to **100 requests per IP per 15 minutes**, configurable via
`RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX_REQUESTS`. Rather than letting
`express-rate-limit` send its own plain 429, the handler forwards a
`TooManyRequestsError` to the global error handler, keeping rejections in the
same envelope as every other error:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests from this IP. Please try again later"
  }
}
```

### Validation error examples

```bash
# 400 - amount must be positive
curl -X POST http://localhost:5000/transactions \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"type":"expense","category":"Food","amount":-450,"date":"2026-09-04"}'
```
```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "Amount must be greater than zero" } }
```

```bash
# 400 - unknown field rejected on PATCH
curl -X PATCH http://localhost:5000/transactions/txn_123 \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"hackedField":"evil"}'
```
```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "Unknown field(s): hackedField. Updatable fields are: type, category, amount, date, description" } }
```

---

## 🔒 Architectural Contract for Team Members (Bhaskar, Sanjana, Komathi, Sangram)

1. **User Identity Access**:
   All protected routes protected by `authMiddleware` automatically have access to:
   ```javascript
   req.user = {
     id: "user_xxx",
     email: "user@example.com"
   };
   ```
   Downstream controllers do **NOT** need to decode or parse JWT tokens manually. Simply consume `req.user.id` to scope transactions and summaries to the authenticated user.

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

---

## 💳 Transactions API (Member 2: Sanjana)

All transaction routes require `Authorization: Bearer <accessToken>`.

### 1. Add Transaction (Income or Expense)
- **Endpoint**: `POST /transactions`
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "type": "income",
    "category": "Salary",
    "amount": 50000,
    "date": "2026-09-01",
    "description": "Monthly Salary"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "txn_1725683200000",
      "userId": "user_1725682800000_abc123",
      "type": "income",
      "category": "Salary",
      "amount": 50000,
      "date": "2026-09-01",
      "description": "Monthly Salary"
    }
  }
  ```

### 2. Fetch All Transactions (With Optional Filtering)
- **Endpoint**: `GET /transactions`
- **Query Parameters**:
  - `type`: `income` or `expense`
  - `category`: string (e.g. `Food`)
  - `startDate`: `YYYY-MM-DD`
  - `endDate`: `YYYY-MM-DD`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "txn_1725683200000",
        "userId": "user_1725682800000_abc123",
        "type": "income",
        "category": "Salary",
        "amount": 50000,
        "date": "2026-09-01",
        "description": "Monthly Salary"
      }
    ]
  }
  ```

### 3. View Single Transaction
- **Endpoint**: `GET /transactions/:id`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "txn_1725683200000",
      "userId": "user_1725682800000_abc123",
      "type": "income",
      "category": "Salary",
      "amount": 50000,
      "date": "2026-09-01",
      "description": "Monthly Salary"
    }
  }
  ```

### 4. Update Transaction
- **Endpoint**: `PATCH /transactions/:id`
- **Request Body** (partial updates allowed):
  ```json
  {
    "amount": 55000,
    "description": "Salary with bonus"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "txn_1725683200000",
      "userId": "user_1725682800000_abc123",
      "type": "income",
      "category": "Salary",
      "amount": 55000,
      "date": "2026-09-01",
      "description": "Salary with bonus"
    }
  }
  ```

### 5. Delete Transaction
- **Endpoint**: `DELETE /transactions/:id`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "txn_1725683200000",
      "userId": "user_1725682800000_abc123",
      "type": "income",
      "category": "Salary",
      "amount": 55000,
      "date": "2026-09-01",
      "description": "Salary with bonus"
    }
  }
  ```

---

## 📊 Summary API (Member 1: Bhaskar)

Requires `Authorization: Bearer <accessToken>`.

### Fetch Financial Summary
- **Endpoint**: `GET /summary` (or `GET /api/summary`)
- **Query Parameters (Optional)**: `category`, `type`, `startDate`, `endDate`
- **Description**: Computes total income, total expenses, net balance, and category-wise totals for the authenticated user.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "totalIncome": 50000,
      "totalExpense": 12000,
      "balance": 38000,
      "transactionCount": 5,
      "categoryBreakdown": {
        "Salary": {
          "total": 50000,
          "count": 1
        },
        "Food": {
          "total": 4000,
          "count": 3
        },
        "Rent": {
          "total": 8000,
          "count": 1
        }
      }
    }
  }
  ```

---

## 🌟 Bonus Features Implemented (20 Points)

1. **Option C: Data Persistence (JSON File Storage)**:
   - Full persistence using Node.js built-in `fs/promises` (`users.json`, `transactions.json`).
   - File reads and writes are asynchronous, safe against missing files (`ENOENT`), and isolated by authenticated user.

2. **Option D: Advanced Middleware**:
   - **Rate Limiting**: Configurable per-IP rate limiting using `express-rate-limit` with custom `TooManyRequestsError` responses.
   - **CORS Support**: Origin whitelist configuration via `CORS_ORIGIN` environment variable.
   - **Request Logging**: Automated request logging with timestamp, HTTP method, URL, status code, latency, and user identification.

---

## 🧪 Automated Testing Suite (Member 4: Sangram)

Member 4 (Sangram) authored the comprehensive test suite covering all endpoints, middleware pipelines, authentication edge cases, transaction operations, and financial summary calculations:

```bash
npm test
```

All 6 test suites pass with 100% success:
- `tests/health.test.js`: Public health check and 404 handler
- `tests/auth.test.js`: User registration, password hashing, login, JWT issuance
- `tests/demo.test.js`: Protected route access and global error handling
- `tests/middleware.test.js`: Input validation, rate limiting, and CORS
- `tests/transaction.test.js`: Transaction CRUD, validation, and user data isolation
- `tests/summary.test.js`: Financial summary calculation, category breakdowns, and query filters