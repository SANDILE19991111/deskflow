const { body, param, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Runs after any express-validator chain to turn accumulated errors
 * into a single 400 ApiError with a readable message.
 */
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((e) => e.msg)
      .join(', ');
    throw new ApiError(400, message);
  }
  next();
}

const loginRules = [
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];

const createTicketRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 120 })
    .withMessage('Title must be 3-120 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be 10-2000 characters'),
  body('priority')
    .notEmpty()
    .withMessage('Priority is required')
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium, or High'),
  handleValidation,
];

const updateTicketStatusRules = [
  param('id').isMongoId().withMessage('Invalid ticket id'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['Open', 'In Progress', 'Resolved'])
    .withMessage('Status must be Open, In Progress, or Resolved'),
  handleValidation,
];

module.exports = { loginRules, createTicketRules, updateTicketStatusRules };
