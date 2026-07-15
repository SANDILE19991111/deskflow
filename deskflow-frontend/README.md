# DeskFlow — Frontend

Internal IT Service Request Portal. React (Vite) + React Router + Tailwind CSS v4.

## Stack

- **Build tool:** Vite
- **UI:** React 19, functional components + hooks only
- **Routing:** react-router-dom (role-gated routes)
- **Styling:** Tailwind CSS v4 (via the `@tailwindcss/vite` plugin — no separate config file needed)
- **HTTP client:** axios, pre-configured in `src/api/client.js`, wired up in Day 4

## Project structure

```
deskflow-frontend/
├── index.html
├── src/
│   ├── main.jsx                 # entry point, providers
│   ├── App.jsx                  # route definitions
│   ├── index.css                # Tailwind import + design tokens
│   ├── auth/
│   │   ├── AuthContext.jsx      # simulated login/logout (see below)
│   │   └── ProtectedRoute.jsx   # route guard by auth + role
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── EmployeeDashboardPage.jsx
│   │   └── AdminDashboardPage.jsx
│   ├── components/
│   │   ├── layout/
│   │   │   └── AppShell.jsx     # shared topbar (identity, sign out)
│   │   └── tickets/
│   │       ├── TicketForm.jsx           # new ticket, client-side validated
│   │       ├── EmployeeTicketList.jsx   # employee's own tickets
│   │       ├── AdminTicketFeed.jsx      # all tickets, admin view
│   │       ├── AdminTicketRow.jsx
│   │       ├── TicketCard.jsx
│   │       ├── StatusStepper.jsx        # Open -> In Progress -> Resolved
│   │       ├── StatusSelect.jsx         # admin inline status control
│   │       └── PriorityTag.jsx
│   ├── api/
│   │   └── client.js            # axios instance, attaches JWT from localStorage
│   ├── data/
│   │   └── mockTickets.js       # placeholder data — removed in Day 4
│   └── utils/
│       ├── validation.js        # mirrors backend's express-validator rules
│       └── formatDate.js
```

## Setup

```bash
npm install
cp .env.example .env   # points at your backend, defaults to localhost:5000
npm run dev
```

Opens on `http://localhost:5173`.

## Day 3 scope — what's real vs. simulated

This milestone is **routing, layout, and auth simulation** — not full API integration (that's Day 4). Concretely:

- **Login is simulated.** Choosing a role and clicking "Sign in" sets a local user object (matching the backend's seeded demo accounts) and stores it in `localStorage` — no network request yet. The email/password fields are there and pre-filled so the form is ready to become real in Day 4 with minimal changes.
- **Tickets are mock data.** `src/data/mockTickets.js` seeds a small set of sample tickets so both dashboards have something real to render and interact with. Creating a ticket or changing its status updates local React state only.
- **Every integration point is marked** with a `// TODO (Day 4):` comment showing exactly what request will replace the mock behavior — see `AuthContext.jsx`, `EmployeeDashboardPage.jsx`, `AdminDashboardPage.jsx`, and `LoginPage.jsx`.
- **`src/api/client.js` is already configured** (base URL from `VITE_API_URL`, JWT attached automatically from `localStorage`) so Day 4 is purely swapping mock function bodies for `api.get/post/put` calls — no new setup required.

## What's genuinely done

- Full routing: `/login`, `/employee`, `/admin`, with role-based redirects and a route guard that bounces an Employee away from `/admin` (and vice versa)
- Component decomposition — no monolithic dashboard file; each concern (form, list, row, status control, priority tag) is its own component
- Client-side form validation matching the backend's exact rules (title 3-120 chars, description 10-2000, priority enum)
- Responsive layout down to mobile
- Visible keyboard focus states, `prefers-reduced-motion` respected
