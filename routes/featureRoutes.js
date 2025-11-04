const express = require("express");
const router = express.Router();
const featureController = require("../controllers/featureController");
const auth = require("../middlewares/authMiddleware");
const cloudUpload = require("../middlewares/multer");

// Property Routes (Protected)

// Create a new property
router.post("/properties/create", auth, cloudUpload.fields([
  { name: 'photos', maxCount: 20 },
  { name: 'video', maxCount: 1 }
]), featureController.createProperty);

// Get all properties (with optional filters)
router.get("/properties", auth, featureController.getAllProperties);

// Get my properties
router.get("/properties/my", auth, featureController.getMyProperties);

// Search properties
router.get("/properties/search", auth, featureController.searchProperties);

// Get property by ID
router.get("/properties/:propertyId", auth, featureController.getPropertyById);

// Get properties by user ID
router.get("/properties/user/:userId", auth, featureController.getPropertiesByUserId);

// Update property
router.put("/properties/:propertyId", auth, featureController.updateProperty);

// Delete property
router.delete("/properties/:propertyId", auth, featureController.deleteProperty);

module.exports = router;
