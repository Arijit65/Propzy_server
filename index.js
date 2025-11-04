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


const PORT = 5000;

db.sequelize
  .sync({ alter: true }) // optional: force: true for full rebuild
  .then(() => {
    const dbName = db.sequelize.config.database;
    console.log(`✅ Connected to PostgreSQL database: ${dbName}`);
    app.listen(PORT, () => {
      console.log(`🚀 Backend running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
  });
