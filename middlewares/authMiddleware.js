const jwt = require("jsonwebtoken");

// General authentication middleware
const authMiddleware = (req, res, next) => {
  console.log('🔒 Auth Middleware - Path:', req.path);
  console.log('🔒 Auth Header:', req.headers.authorization ? 'Present' : 'Missing');
  
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log('❌ No token provided');
    return res.status(401).json({ 
      success: false,
      error: "Unauthorized - No token provided" 
    });
  }

  const token = authHeader.split(" ")[1];
  console.log('🔑 Token received:', token.substring(0, 20) + '...');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded - User:', decoded.id, 'Role:', decoded.role);
    req.user = decoded; // { id, role, iat, exp }
    next();
  } catch (err) {
    console.log('❌ Token verification failed:', err.message);
    return res.status(403).json({ 
      success: false,
      error: "Invalid or expired token",
      details: err.message
    });
  }
};

// Admin-only middleware
const isAdmin = (req, res, next) => {
  console.log('👮 Admin Check - User:', req.user ? req.user.id : 'None', 'Role:', req.user ? req.user.role : 'None');
  
  if (!req.user) {
    console.log('❌ No user in request');
    return res.status(401).json({ 
      success: false,
      error: "Unauthorized - Authentication required" 
    });
  }

  if (req.user.role !== 'admin') {
    console.log('❌ User is not admin, role:', req.user.role);
    return res.status(403).json({ 
      success: false,
      error: "Forbidden - Admin access required" 
    });
  }

  console.log('✅ Admin access granted');
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
