# DeskFlow — Backend API

Internal IT Service Request Portal. Node.js + Express + MongoDB (Mongoose).

## Stack

- **Runtime:** Node.js 18+, Express 4
- **Database:** MongoDB via Mongoose ODM
- **Auth:** JWT (`jsonwebtoken`), password hashing (`bcryptjs`)
- **Validation:** `express-validator`
- **Docs:** `swagger-jsdoc` + `swagger-ui-express` at `/api-docs`

## Project structure

```
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
├── .env.example
└── .gitignore
```

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
- **Central error handler** normalizes Mongoose `ValidationError`, `CastError`, and duplicate-key errors into consistent `400`/`404`/`409` JSON responses, so malformed input never crashes the process.
- **Role gating** (`requireRole('Admin')`) is separate from auth (`protect`), so it's easy to see at the route-definition level exactly who can hit each endpoint.

## Not yet done (Day 2 scope)

- Additional endpoint-level tests beyond the smoke-test pass done during scaffolding
- Postman collection / finalized OpenAPI polish
- Rate limiting, helmet, and other hardening (optional stretch)
