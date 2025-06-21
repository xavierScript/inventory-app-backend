const jwt = require("jsonwebtoken");
const { db } = require("../database");

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};

// Middleware to check if user is admin or the owner of the resource
const requireAdminOrOwner = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.user.role === "admin" || req.user.id === parseInt(req.params.id)) {
    next();
  } else {
    return res.status(403).json({ message: "Access denied" });
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireAdminOrOwner,
};
