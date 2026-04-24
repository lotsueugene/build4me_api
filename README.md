# Build4Me API 

Build4Me is an AI-powered construction milestone verification platform designed for diaspora-funded building projects. Clients can track construction progress, contractors can post updates, and inspectors can verify milestones.

## API Documentation
https://documenter.getpostman.com/view/51612020/2sBXqCPPa6#c97aa43e-8df0-455d-b70c-4e63c8c769d6

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** SQLite with Sequelize ORM
- **Testing:** Jest & Supertest

## Setup & Installation

1. Clone the repository:
```bash
git clone https://github.com/lotsueugene/build4me_api.git
cd build4me_api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```
PORT=3000
DB_NAME=build4me.db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

`JWT_SECRET` and `JWT_EXPIRES_IN` are required for issuing tokens on login. Protected routes expect `Authorization: Bearer <token>`.

4. Seed the database:
```bash
npm run seed
```

5. Start the server:
```bash
npm run dev
```

The server will run at `http://localhost:3000`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with nodemon (auto-restart) |
| `npm start` | Start server with node |
| `npm run seed` | Seed the database with sample data |
| `npm test` | Run all tests |

## Database Models

### User

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | STRING | Yes | |
| email | STRING | Yes | Must be unique, valid email |
| password | STRING | Yes | Min 6 characters |
| role | STRING | Yes | `client`, `contractor`, `inspector`, or `admin` (default: `client`) |

### Project

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | STRING | Yes | |
| description | TEXT | No | |
| location | STRING | Yes | |
| startDate | DATE | Yes | |
| status | STRING | No | ongoing, completed, or paused (default: ongoing) |
| clientId | INTEGER | No | References User |
| contractorId | INTEGER | No | References User |

### Update

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| description | TEXT | Yes | |
| mediaUrl | STRING | No | |
| status | STRING | No | pending, verified, or rejected (default: pending) |
| projectId | INTEGER | Yes | References Project |
| userId | INTEGER | Yes | References User (contractor) |

### Inspection

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| status | STRING | Yes | verified or rejected |
| comments | TEXT | No | |
| inspectionDate | DATE | No | Defaults to current date |
| projectId | INTEGER | Yes | References Project |
| inspectorId | INTEGER | Yes | References User (inspector) |
| updateId | INTEGER | Yes | References Update |

## API Endpoints

### Authentication

Base path: **`/api/auth`**

#### POST /api/auth/register

Creates a new user account (password is hashed before storage).

| Field | Required | Notes |
|-------|----------|--------|
| `name` | Yes | Display name |
| `email` | Yes | Must be a valid email; must be unique |
| `password` | Yes | Stored hashed (min length enforced by the User model, e.g. 6+ characters) |
| `role` | No | One of `client`, `contractor`, `inspector`, `admin` (defaults per model if omitted) |

**Request body example:**

```json
{
  "name": "Ama Boateng",
  "email": "ama@example.com",
  "password": "securepassword",
  "role": "client"
}
```

**Responses**

| Status | Body |
|--------|------|
| `201 Created` | `{ "message": "User registered successfully", "user": { "id", "name", "email" } }` |
| `400 Bad Request` | `{ "errors": [...] }` if email/password fail validation (express-validator) |
| `400 Bad Request` | `{ "error": "User with this email already exists" }` if email is taken |
| `500 Internal Server Error` | `{ "error": "Failed to register user" }` |

---

#### POST /api/auth/login

Authenticates a user and returns a JWT.

| Field | Required |
|-------|----------|
| `email` | Yes |
| `password` | Yes |

**Request body example:**

```json
{
  "email": "ama@example.com",
  "password": "securepassword"
}
```

**Responses**

| Status | Body |
|--------|------|
| `200 OK` | `{ "message": "Login successful", "token": "<jwt>", "user": { "id", "name", "email" } }` |
| `401 Unauthorized` | `{ "error": "Invalid email or password" }` |
| `500 Internal Server Error` | `{ "error": "Failed to login" }` |

The JWT payload includes `id`, `name`, `email`, and `role`. Use it on protected routes as:

`Authorization: Bearer <token>`

---

#### POST /api/auth/logout

Stateless placeholder: returns success. Clients should discard the JWT locally (the API does not maintain a server-side session list for tokens).

**Response:** `200 OK`

```json
{
  "message": "Logout successful"
}
```

---

### Users

#### GET /api/users
Returns all users.

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "name": "Kwame Mensah",
    "email": "kwame@example.com",
    "role": "client",
    "createdAt": "2026-04-13T20:37:22.373Z",
    "updatedAt": "2026-04-13T20:37:22.373Z"
  }
]
```

#### GET /api/users/:id
Returns a single user by ID.

**Response:** `200 OK` or `404 Not Found`

#### POST /api/users
Creates a new user.

- **Required fields:** name, email, password
- **Optional fields:** role

**Request body:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "role": "client"
}
```

**Response:** `201 Created`

#### PUT /api/users/:id
Updates an existing user.

- **Request body:** Any user fields to update

**Response:** `200 OK` or `404 Not Found`

#### DELETE /api/users/:id
Deletes a user.

**Response:** `200 OK` or `404 Not Found`

### Projects

#### GET /api/projects
Returns all projects.

**Response:** `200 OK`

#### GET /api/projects/:id
Returns a single project by ID.

**Response:** `200 OK` or `404 Not Found`

#### POST /api/projects
Creates a new project.

- **Required fields:** title, location, startDate
- **Optional fields:** description, status, clientId, contractorId

**Request body:**
```json
{
  "title": "3-Bedroom House Build",
  "description": "Construction of a 3-bedroom house",
  "location": "East Legon, Accra",
  "startDate": "2026-01-15",
  "status": "ongoing",
  "clientId": 1,
  "contractorId": 2
}
```

**Response:** `201 Created`

#### PUT /api/projects/:id
Updates an existing project.

- **Request body:** Any project fields to update

**Response:** `200 OK` or `404 Not Found`

#### DELETE /api/projects/:id
Deletes a project.

**Response:** `200 OK` or `404 Not Found`

### Updates

#### GET /api/updates
Returns all updates.

**Response:** `200 OK`

#### GET /api/updates/:id
Returns a single update by ID.

**Response:** `200 OK` or `404 Not Found`

#### POST /api/updates
Creates a new update.

- **Required fields:** description, projectId, userId
- **Optional fields:** mediaUrl, status

**Request body:**
```json
{
  "description": "Foundation completed and cured",
  "mediaUrl": "https://example.com/photos/foundation.jpg",
  "projectId": 1,
  "userId": 2
}
```

**Response:** `201 Created`

#### PUT /api/updates/:id
Updates an existing update.

- **Request body:** Any update fields to update

**Response:** `200 OK` or `404 Not Found`

#### DELETE /api/updates/:id
Deletes an update.

**Response:** `200 OK` or `404 Not Found`

### Inspections

#### GET /api/inspections
Returns all inspections.

**Response:** `200 OK`

#### GET /api/inspections/:id
Returns a single inspection by ID.

**Response:** `200 OK` or `404 Not Found`

#### POST /api/inspections
Creates a new inspection.

- **Required fields:** status, projectId, inspectorId, updateId
- **Optional fields:** comments, inspectionDate

**Request body:**
```json
{
  "status": "verified",
  "comments": "Foundation meets structural requirements",
  "projectId": 1,
  "inspectorId": 3,
  "updateId": 1
}
```

**Response:** `201 Created`

#### PUT /api/inspections/:id
Updates an existing inspection.

- **Request body:** Any inspection fields to update

**Response:** `200 OK` or `404 Not Found`

#### DELETE /api/inspections/:id
Deletes an inspection.

**Response:** `200 OK` or `404 Not Found`

## Error Responses

All errors return JSON in this format:

```json
{
  "error": "Error message here"
}
```

| Status Code | Meaning |
|-------------|---------|
| 400 | Bad Request — missing required fields |
| 404 | Not Found — resource does not exist |
| 500 | Internal Server Error |
