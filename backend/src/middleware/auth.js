const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'quest_decoupled_prisma_jwt_secret_2026_key_9981';

/**
 * Middleware: Verify Bearer JWT Token
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired authentication token.' });
  }
}

/**
 * Middleware: Enforce Role-Based Access Control (RBAC)
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: 'Access forbidden. User role missing.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access forbidden. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`
      });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole,
  JWT_SECRET
};
