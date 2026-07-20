# DeskFlow – Internal IT Service Request Portal

**Live Demo:** https://deskflow-1-9f0l.onrender.com

---

## Overview

DeskFlow is a secure internal IT ticketing system that enables employees to report technical issues while allowing IT administrators to manage and resolve support requests efficiently.

The application demonstrates modern backend development practices, including JWT authentication, role-based authorization, RESTful API design, MongoDB persistence, request validation, and centralized error handling.

Built with **Node.js**, **Express**, and **MongoDB**, DeskFlow simulates a real-world enterprise helpdesk workflow.

---

## Key Features

### User Authentication

* Secure login using JWT
* Password hashing with bcryptjs
* Role-based access control
* Protected API endpoints

### Employee Portal

* Create IT support tickets
* Specify title, description, and priority
* View only personal tickets
* Secure server-side filtering

### Administrator Portal

* View all submitted tickets
* Update ticket status
* Track issue progress
* Manage support workflow

### Ticket Lifecycle

Supported ticket statuses:

* Open
* In Progress
* Resolved

Supported priority levels:

* Low
* Medium
* High

---

## API Features

* RESTful API architecture
* JWT authentication
* Role-based authorization
* Request validation using express-validator
* MongoDB data persistence with Mongoose
* Centralized error handling
* Health check endpoint
* Interactive Swagger API documentation

---

## Project Structure

```text
server.js
src/
├── app.js
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   └── ticketController.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── validators.js
├── models/
│   ├── User.js
│   └── Ticket.js
├── routes/
│   ├── authRoutes.js
│   └── ticketRoutes.js
└── utils/
    └── seed.js
```

---

## Technology Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Tokens (JWT)
* bcryptjs
* express-validator
* Swagger UI
* Postman

---

## Authentication

DeskFlow uses JWT-based authentication.

After logging in, the API returns a JSON Web Token that must be included in all protected requests.

```
Authorization: Bearer <your_token>
```

---

## Demo Accounts

### Employee

**Email**

```
employee@deskflow.io
```

**Password**

```
password123
```

---

### Administrator

**Email**

```
admin@deskflow.io
```

**Password**

```
password123
```

---

## API Endpoints

| Method | Endpoint           | Access         | Description                                       |
| ------ | ------------------ | -------------- | ------------------------------------------------- |
| POST   | `/api/auth/login`  | Public         | Authenticate user and return JWT                  |
| POST   | `/api/tickets`     | Employee       | Create a new support ticket                       |
| GET    | `/api/tickets`     | Employee/Admin | Employee sees own tickets, Admin sees all tickets |
| PUT    | `/api/tickets/:id` | Admin          | Update ticket status                              |
| GET    | `/api/health`      | Public         | API health check                                  |

---

## Running the Project

```bash
git clone <repository-url>

cd deskflow

npm install
```

Create a `.env` file.

```env
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

PORT=5000
```

Start the development server.

```bash
npm run dev
```

Seed the demo users.

```bash
node src/utils/seed.js
```

Open Swagger documentation.

```
http://localhost:5000/api-docs
```

---

## Testing

You can test the API using:

* Swagger UI
* Postman Collection (`postman/DeskFlow.postman_collection.json`)
* PowerShell test script (`test-api.ps1`)

---

## Technical Highlights

During development, the project focused on implementing production-style backend practices, including:

* Secure password hashing
* JWT authentication
* Role-based authorization
* Server-side access control
* MongoDB ObjectId relationships
* Request validation
* Centralized error handling
* Clean MVC architecture
* Environment variable management

---

## Future Improvements

* Frontend dashboard using React
* Email notifications for ticket updates
* File attachments
* Ticket comments
* Search and filtering
* Pagination
* Dashboard analytics
* Priority-based SLA tracking
* Docker deployment
* CI/CD pipeline with GitHub Actions

---

## Lessons Learned

Building DeskFlow strengthened my skills in:

* Backend API development
* Express.js architecture
* MongoDB and Mongoose
* Authentication with JWT
* Authorization and role-based security
* REST API design
* Input validation
* Error handling
* Database modeling
* API documentation using Swagger

---

## Impact

DeskFlow demonstrates how a secure backend can power an internal IT helpdesk by enforcing authentication, role-based permissions, and reliable ticket management. The project reflects real-world backend engineering practices commonly used in enterprise applications.

**DeskFlow — simplifying internal IT support through secure, scalable backend engineering.**
