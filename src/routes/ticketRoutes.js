const express = require('express');
const {
  createTicket,
  getTickets,
  updateTicketStatus,
} = require('../controllers/ticketController');
const { protect, requireRole } = require('../middleware/auth');
const {
  createTicketRules,
  updateTicketStatusRules,
} = require('../middleware/validators');

const router = express.Router();

// All ticket routes require a valid token
router.use(protect);

/**
 * @openapi
 * /api/tickets:
 *   post:
 *     tags: [Tickets]
 *     summary: Create a new IT service ticket (Employee only)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, priority]
 *             properties:
 *               title: { type: string, example: "Laptop won't power on" }
 *               description: { type: string, example: "Held power button for 30s, no lights, tried a different outlet." }
 *               priority: { type: string, enum: [Low, Medium, High], example: High }
 *     responses:
 *       201: { description: Ticket created }
 *       400: { description: Validation error }
 *       401: { description: Not authenticated }
 *       403: { description: Not an Employee }
 *   get:
 *     tags: [Tickets]
 *     summary: List tickets (own tickets for Employees, all tickets for Admins)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [Open, In Progress, Resolved] }
 *       - in: query
 *         name: priority
 *         schema: { type: string, enum: [Low, Medium, High] }
 *     responses:
 *       200: { description: List of tickets }
 *       401: { description: Not authenticated }
 */
router
  .route('/')
  .post(requireRole('Employee'), createTicketRules, createTicket)
  .get(getTickets);

/**
 * @openapi
 * /api/tickets/{id}:
 *   put:
 *     tags: [Tickets]
 *     summary: Update a ticket's status (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [Open, In Progress, Resolved] }
 *     responses:
 *       200: { description: Ticket updated }
 *       400: { description: Validation error }
 *       401: { description: Not authenticated }
 *       403: { description: Not an Admin }
 *       404: { description: Ticket not found }
 */
router.route('/:id').put(requireRole('Admin'), updateTicketStatusRules, updateTicketStatus);

module.exports = router;
