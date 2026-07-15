const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Verifies the Bearer token on the Authorization header and attaches
 * the decoded payload ({ id, role, name, email }) to req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new ApiError(401, 'Not authorized — no token provided');
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    throw new ApiError(401, 'Not authorized — token invalid or expired');
  }
});

/**
 * Role-gate factory. Usage: requireRole('Admin') or requireRole('Admin', 'Employee')
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw new ApiError(403, `Forbidden — requires role: ${roles.join(' or ')}`);
  }
  next();
};

module.exports = { protect, requireRole };
