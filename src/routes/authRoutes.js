const express = require('express');
const { login } = require('../controllers/authController');
const { loginRules } = require('../middleware/validators');

const router = express.Router();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in and receive a JWT
 *     description: Authenticates against seeded demo accounts and returns a token plus user role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: employee@deskflow.io
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Missing or malformed credentials
 *       401:
 *         description: Invalid email or password
 */
router.post('/login', loginRules, login);

module.exports = router;
