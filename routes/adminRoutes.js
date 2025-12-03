// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/authMiddleware');

// Admin routes - require both authentication AND admin role
// All routes now use authentication middleware to get real user ID

// IMPORTANT: Specific routes must come BEFORE parameterized routes to avoid conflicts
// Property categorization routes (must be before /:propertyId)
router.get('/properties', authMiddleware, isAdmin, propertyController.getAllPropertiesForAdmin);
router.patch('/properties/bulk-categorize', authMiddleware, isAdmin, propertyController.bulkUpdatePropertyCategorization);
router.patch('/properties/:propertyId/categorize', authMiddleware, isAdmin, propertyController.updatePropertyCategorization);

// Basic admin property routes
router.post('/', authMiddleware, isAdmin, propertyController.createProperty);
router.get('/', authMiddleware, isAdmin, propertyController.getAllProperties);
router.get('/:propertyId', propertyController.getPropertyById);
router.put('/:propertyId/approve', authMiddleware, isAdmin, propertyController.approveProperty);
router.put('/:propertyId/reject', authMiddleware, isAdmin, propertyController.rejectProperty);
router.delete('/:propertyId', authMiddleware, isAdmin, propertyController.deleteProperty);

// ==================== ENQUIRY ROUTES ====================
// Get all enquiries with filters
router.get('/enquiries', authMiddleware, isAdmin, propertyController.getAllEnquiries);

// Get enquiry statistics
router.get('/enquiries/stats', authMiddleware, isAdmin, propertyController.getEnquiryStats);

// Get single enquiry by ID
router.get('/enquiries/:enquiryId', authMiddleware, isAdmin, propertyController.getEnquiryById);

// Update enquiry status
router.put('/enquiries/:enquiryId/status', authMiddleware, isAdmin, propertyController.updateEnquiryStatus);

// Delete enquiry
router.delete('/enquiries/:enquiryId', authMiddleware, isAdmin, propertyController.deleteEnquiry);

module.exports = router;
