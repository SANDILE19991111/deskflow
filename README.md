# DeskFlow — Backend

Internal IT Service Request Portal. Node.js + Express + MongoDB (Mongoose).

## Stack

- **Runtime:** Node.js 18+, Express 4
- **Database:** MongoDB via Mongoose ODM
- **Auth:** JWT (`jsonwebtoken`), password hashing (`bcryptjs`)
- **Validation:** `express-validator`
- **Docs:** `swagger-jsdoc` + `swagger-ui-express` at `/api-docs`

## Project structure

deskflow-backend/
├── server.js                  # entry point
├── src/
│   ├── app.js                 # Express app: middleware, routes, docs
│   ├── config/
│   │   ├── db.js               # Mongoose connection
│   │   └── swagger.js          # OpenAPI spec generation
│   ├── models/
│   │   ├── User.js
│   │   └── Ticket.js
│   ├── middleware/
│   │   ├── auth.js             # protect() + requireRole()
│   │   ├── errorHandler.js     # notFound() + central error handler
│   │   └── validators.js       # express-validator rule sets
│   ├── controllers/
│   │   ├── authController.js
│   │   └── ticketController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── ticketRoutes.js
│   └── utils/
│       ├── ApiError.js
│       ├── asyncHandler.js
│       └── seed.js             # creates demo Employee + Admin accounts
├── postman/
│   ├── DeskFlow.postman_collection.json
│   └── DeskFlow.postman_environment.json
├── test-api.ps1                # PowerShell endpoint test suite
├── .env.example
└── .gitignore

## Setup

```bash
npm install
cp .env.example .env       # then fill in MONGO_URI, JWT_SECRET, etc.
npm run dev                # nodemon, or: npm start
node src/utils/seed.js     # creates the two demo accounts below
```

Swagger UI: `http://localhost:5000/api-docs`
Health check: `GET /api/health`

## Demo credentials (created by the seed script)

| Role     | Email                | Password    |
|----------|-----------------------|-------------|
| Employee | employee@deskflow.io  | password123 |
| Admin    | admin@deskflow.io     | password123 |

## Endpoints

| Method | Path                  | Access          | Description                                  |
|--------|------------------------|-----------------|-----------------------------------------------|
| POST   | `/api/auth/login`      | Public          | Returns JWT + user role                       |
| POST   | `/api/tickets`         | Employee        | Create a ticket                                |
| GET    | `/api/tickets`         | Employee, Admin | Employees see own tickets; Admins see all      |
| PUT    | `/api/tickets/:id`     | Admin           | Update ticket status                           |

All `/api/tickets*` routes require `Authorization: Bearer <token>`.

## Design notes

- **Auth is "simulated" but backed by real seeded accounts** rather than a pure role-toggle, so `createdBy` on tickets is a genuine ObjectId reference — this is what makes the "employees only see their own tickets" rule actually enforceable at the query level (`Ticket.find({ createdBy: req.user.id })`), not just a UI-side filter.
- **Central error handler** normalizes Mongoose `ValidationError`, `CastError`, duplicate-key errors, and malformed JSON bodies into consistent `400`/`404`/`409` JSON responses, so malformed input never crashes the process.
- **Role gating** (`requireRole('Admin')`) is separate from auth (`protect`), so it's easy to see at the route-definition level exactly who can hit each endpoint.

## Testing

Two ways to verify every endpoint:

1. **Postman** — import `postman/DeskFlow.postman_collection.json` and `.postman_environment.json`, run the collection.
2. **PowerShell script** — `.\test-api.ps1` (server must already be running). Runs all 18 scenarios (happy paths + 400/401/403/404 cases) and prints a pass/fail summary.

## Day 2 — Business Logic & Testing

Controller logic and validation were largely built alongside the Day 1 scaffold, so Day 2 focused on proving all of it actually works — not just that it exists.

**A real bug got caught and fixed here:** Express's body parser throws malformed-JSON errors with an `err.status` property, but the error handler was only checking `err.statusCode` — meaning bad JSON was silently returning `500` instead of `400`. Fixed in `src/middleware/errorHandler.js`.

**Testing was done two ways, both against the live server with a real MongoDB Atlas connection:**

1. **Postman collection** (`deskflow-backend/postman/`) — 17 requests across Auth, Tickets, and Misc folders, with `pm.test()` assertions on every request. Login requests automatically capture JWTs into collection variables so the rest of the suite runs without manual token copying.

2. **PowerShell test script** (`deskflow-backend/test-api.ps1`) — runs all 18 scenarios end-to-end against `localhost:5000`: every happy path (login, create/get/update tickets) plus every error case the evaluation criteria calls for — wrong password (401), invalid payload (400), wrong role attempting an action (403, both directions), missing token (401), invalid status enum (400), malformed MongoDB ObjectId (400), a well-formed but nonexistent ticket ID (404), and an unknown route (404).

=== Results: 18 passed, 0 failed ===

This confirms the two behaviors the brief specifically requires: employees can only ever retrieve tickets where `createdBy` matches their own user ID, and every standard HTTP status code (400/401/403/404) is returned correctly rather than the API crashing or falling back to a generic 500.

**Result: 18/18 passing**, run directly against the real Atlas-backed database — not mocked.