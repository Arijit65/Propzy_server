const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectCloudinary = require ('./config/cloudinary.js');
const db = require("./models");


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads")); // Serve static files from the uploads directory

// Global request logging middleware
app.use((req, res, next) => {
  const bodySize = req.body ? JSON.stringify(req.body).length : 0;
  console.log(`📨 ${req.method} ${req.path} - Body size: ${bodySize} bytes`);
  next();
});

connectCloudinary();

// Serve uploaded files
app.use("/uploads", express.static("uploads"));



// ✅ Import Routes
const userRoutes = require("./routes/userRoute");
const featureRoutes = require("./routes/featureRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");

// ✅ Register Routes
app.use("/api/users", userRoutes);
app.use("/api/properties", featureRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes); // Also support /auth for backward compatibility

// 404 handler for undefined routes
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
    hint: "Available auth routes: POST /api/auth/admin/login or POST /auth/admin/login"
  });
}); 


const PORT = 5000;

// Handle unhandled errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit process - keep server running
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  // Don't exit process - keep server running
});

// Keep process alive
process.stdin.resume();

let server;
db.sequelize
  .sync() // Just sync without alter to avoid re-creating constraints
  .then(() => {
    const dbName = db.sequelize.config.database;
    console.log(`✅ Connected to PostgreSQL database: ${dbName}`);
    server = app.listen(PORT, () => {
      console.log(`🚀 Backend running at http://localhost:${PORT}`);
      console.log(`📝 Press Ctrl+C to stop the server`);
    });

    // Handle server close events
    server.on('close', () => {
      console.log('ℹ️ Server connection closed');
    });

    server.on('error', (error) => {
      console.error('❌ Server error:', error);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  if (server) {
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
