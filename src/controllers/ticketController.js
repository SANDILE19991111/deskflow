const Ticket = require('../models/Ticket');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * POST /api/tickets
 * Employee-only. Creates a ticket owned by the authenticated user.
 */
const createTicket = asyncHandler(async (req, res) => {
  const { title, description, priority } = req.body;

  const ticket = await Ticket.create({
    title,
    description,
    priority,
    createdBy: req.user.id,
  });

  res.status(201).json({ success: true, data: ticket });
});

/**
 * GET /api/tickets
 * Employees see only their own tickets; Admins see every ticket.
 * Supports optional ?status= and ?priority= filters for both roles.
 */
const getTickets = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.user.role === 'Employee') {
    filter.createdBy = req.user.id;
  }

  if (req.query.status) filter.status = req.query.status;
  if (req.query.priority) filter.priority = req.query.priority;

  const tickets = await Ticket.find(filter)
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: tickets.length, data: tickets });
});

/**
 * PUT /api/tickets/:id
 * Admin-only. Updates a ticket's status.
 */
const updateTicketStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const ticket = await Ticket.findById(id);
  if (!ticket) {
    throw new ApiError(404, `Ticket not found with id ${id}`);
  }

  ticket.status = status;
  await ticket.save();

  res.status(200).json({ success: true, data: ticket });
});

module.exports = { createTicket, getTickets, updateTicketStatus };
