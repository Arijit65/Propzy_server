const jwt = require("jsonwebtoken");

// General authentication middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      success: false,
      error: "Unauthorized - No token provided" 
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, iat, exp }
    next();
  } catch (err) {
    return res.status(403).json({ 
      success: false,
      error: "Invalid or expired token" 
    });
  }
};

// Admin-only middleware
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      error: "Unauthorized - Authentication required" 
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      error: "Forbidden - Admin access required" 
    });
  }

  next();
};

// User-only middleware (optional - for routes that should exclude admins)
const isUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      error: "Unauthorized - Authentication required" 
    });
  }

  if (req.user.role !== 'user') {
    return res.status(403).json({ 
      success: false,
      error: "Forbidden - User access required" 
    });
  }

  next();
};

module.exports = authMiddleware;
module.exports.isAdmin = isAdmin;
module.exports.isUser = isUser;
module.exports.authenticate = authMiddleware; // Alias for compatibility
