const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");

// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);

// Protected routes
router.get("/me", auth, userController.getCurrentUser);
router.put("/username", auth, userController.setUsername);

module.exports = router;
