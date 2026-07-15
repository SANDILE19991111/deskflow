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


## Day 3 — Frontend Core Setup

Bootstrapped the React app with Vite, React Router, and Tailwind CSS v4, and built out the routing/layout skeleton the rest of the frontend hangs off of.

**Routing (`src/App.jsx`):**
- `/login` — public
- `/employee` — protected, Employee role only
- `/admin` — protected, Admin role only
- A route guard (`src/auth/ProtectedRoute.jsx`) redirects unauthenticated users to `/login`, and redirects a logged-in user to *their own* dashboard if they try to visit the wrong one (e.g. an Employee hitting `/admin` gets bounced to `/employee`, not shown an error page).

**Auth simulation (`src/auth/AuthContext.jsx`):**
Per the brief, the login screen offers a toggle between Employee and Admin to test role-based views. Rather than a bare mock toggle, it's backed by the real seeded demo accounts (`employee@deskflow.io` / `admin@deskflow.io`), so the same component structure carries straight through into Day 4's real API integration without a rewrite.

**Component decomposition** — deliberately broken apart rather than built as monolithic dashboard files, since this is directly called out in the evaluation criteria:

- `TicketForm.jsx` — new ticket submission, with client-side validation mirroring the backend's exact rules (title 3–120 chars, description 10–2000, priority enum)
- `TicketCard.jsx` / `AdminTicketRow.jsx` — individual ticket display, employee vs. admin variants
- `EmployeeTicketList.jsx` / `AdminTicketFeed.jsx` — list containers with empty states
- `StatusStepper.jsx` — status shown as a position along Open → In Progress → Resolved, since status is genuinely a workflow stage, not just a flat label
- `StatusSelect.jsx` — the admin's inline status-update control
- `PriorityTag.jsx` — small priority indicator
- `AppShell.jsx` — shared topbar (role badge, name, sign out) wrapping both dashboards

**Design direction:** since this is an internal ops tool rather than a marketing page, the UI intentionally stays restrained — a slate/indigo palette, Space Grotesk for headings, monospace for ticket IDs and timestamps (fits the technical subject matter), full keyboard focus states, and `prefers-reduced-motion` respected.

At the end of Day 3, both dashboards were fully interactive against **mock data** (`src/data/mockTickets.js`) — every integration point was marked with a `// TODO (Day 4):` comment showing exactly what backend call would replace it.

## Day 4 — Full-Stack Integration

Connected the React frontend to the real backend API, replacing every mock-data integration point flagged in Day 3.

**Repo restructure:** the project was reorganized into this monorepo layout — `deskflow-backend/` and `deskflow-frontend/` as sibling folders under one root — so both halves of the stack live together with a shared history, rather than as two disconnected repos.

**What changed from Day 3's mocked version:**

- **Login (`LoginPage.jsx` + `AuthContext.jsx`)** — the role toggle now sends a real `POST /api/auth/login` request with the selected demo account's credentials, receives an actual signed JWT back, and stores it in `localStorage`. Every subsequent request automatically attaches it via an axios interceptor (`src/api/client.js`), so `protect` and `requireRole` on the backend are now doing real work against real requests, not being bypassed by mock state.

- **Employee dashboard** — `GET /api/tickets` on load fetches the logged-in employee's own tickets (filtered server-side, not client-side) via `useEffect`; submitting the form now calls `POST /api/tickets` and prepends the real created ticket — with its real MongoDB `_id` — to the list.

- **Admin dashboard** — fetches every ticket in the organization on load, and the inline status dropdown now calls `PUT /api/tickets/:id`, updating local state from the server's response rather than assuming the change succeeded.

- **Error states** — both dashboards surface backend error messages directly in the UI (e.g. a failed fetch or a validation rejection shows the actual `message` field from the API's JSON error response), rather than failing silently.

`src/data/mockTickets.js` is no longer used by either dashboard as of this point — the app is running end-to-end against the same MongoDB Atlas database the backend's Postman/PowerShell tests were verified against in Day 2.

**Known rough edge going into Day 5:** a few files (`App.jsx`, `LoginPage.jsx`, `AuthContext.jsx`, `api/client.js`, `ProtectedRoute.jsx`) were found emptied out during a later local sync issue unrelated to the actual Day 4 commit — restored from git history (`git show HEAD:...`) without incident, confirming the committed Day 4 work itself was intact throughout. Worth a clean end-to-end retest as part of Day 5.