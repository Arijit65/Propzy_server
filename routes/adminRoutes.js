const express = require('express');
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middlewares/authMiddleware");

// Admin routes for property management (protected - requires admin role)
router.get('/properties', auth, adminController.getAllProperties);
router.patch('/properties/:propertyId/approve', auth, adminController.approveProperty);
router.patch('/properties/:propertyId/reject', auth, adminController.rejectProperty);
router.delete('/properties/:propertyId', auth, adminController.deleteProperty);

module.exports = router;
