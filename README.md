# Build4Me API MVP

Build4Me is an AI-powered construction milestone verification platform designed for diaspora-funded building projects. Clients can track construction progress, contractors can post updates, and inspectors can verify milestones.

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
```

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
| role | STRING | Yes | client, contractor, or inspector (default: client) |

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
