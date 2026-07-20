Project: DeskFlow — Internal IT ticketing (Node.js + Express + MongoDB/Mongoose)

Problem
Employees create IT tickets (title, description, priority). Admins view all tickets and update status. Server-enforced role-based access, persistent storage, and robust error handling.

Tech
- Node.js 18+, Express
- MongoDB + Mongoose
- JWT (jsonwebtoken), bcryptjs
- express-validator
- Swagger (swagger-jsdoc + swagger-ui-express) or Postman

Structure (key files)
- server.js
- src/app.js
- src/config/db.js
- src/models/User.js, Ticket.js
- src/controllers/authController.js, ticketController.js
- src/routes/authRoutes.js, ticketRoutes.js
- src/middleware/auth.js, errorHandler.js, validators.js
- src/utils/seed.js (creates demo Employee/Admin)

Demo creds (seeded)
- employee@deskflow.io / password123
- admin@deskflow.io / password123

Endpoints
- POST /api/auth/login — returns JWT + role
- POST /api/tickets — Employee only; create ticket (title, description, priority)
- GET /api/tickets — Employee: own tickets; Admin: all tickets
- PUT /api/tickets/:id — Admin only; update status (Open, In Progress, Resolved)

All /api/tickets* require Authorization: Bearer <token>.

Setup
1. npm install
2. cp .env.example .env — set MONGO_URI, JWT_SECRET, PORT
3. npm run dev (or npm start)
4. node src/utils/seed.js
5. Swagger UI: http://localhost:<PORT>/api-docs
6. Health: GET /api/health

Testing
- Import postman/DeskFlow.postman_collection.json OR use /api-docs.
- Optional: run test-api.ps1 for full scenario suite.

Notes
- Auth backed by seeded users so createdBy is a real ObjectId and server-side filtering enforces access.
- Central error handler normalizes Mongoose and JSON errors into proper 4xx responses.
