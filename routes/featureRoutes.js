const express = require("express");
const router = express.Router();
const featureController = require("../controllers/featureController");
const auth = require("../middlewares/authMiddleware");
const cloudUpload = require("../middlewares/multer");

// Property Routes

// Create a new property (Protected)
router.post("/properties/create", auth, cloudUpload.fields([
  { name: 'photos', maxCount: 20 },
  { name: 'video', maxCount: 1 }
]), featureController.createProperty);

// Get all properties from all locations (Public)
router.get("/all-locations", featureController.getAllLocationsProperties);

// Get properties by location/city (Public)
router.get("/properties/:location", featureController.getPropertiesByLocation);

// Get all properties (with optional filters) - Legacy route
router.get("/properties", featureController.getAllProperties);

// Get my properties (Protected)
router.get("/my-properties", auth, featureController.getMyProperties);

// Search properties (Public)
router.get("/search", featureController.searchProperties);

// Get property by ID (Public for approved, Protected for others)
router.get("/property/:propertyId", featureController.getPropertyById);

// Get properties by user ID (Protected)
router.get("/user/:userId/properties", auth, featureController.getPropertiesByUserId);

// Update property (Protected)
router.put("/property/:propertyId", auth, featureController.updateProperty);

// Delete property (Protected)
router.delete("/property/:propertyId", auth, featureController.deleteProperty);

module.exports = router;
