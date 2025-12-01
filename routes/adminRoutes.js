// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/authMiddleware');

// Admin routes - require both authentication AND admin role
// All routes now use authentication middleware to get real user ID

router.post('/', authMiddleware, isAdmin, propertyController.createProperty);
router.get('/', authMiddleware, isAdmin, propertyController.getAllProperties);
router.get('/:propertyId', propertyController.getPropertyById);
router.put('/:propertyId/approve', authMiddleware, isAdmin, propertyController.approveProperty);
router.put('/:propertyId/reject', authMiddleware, isAdmin, propertyController.rejectProperty);
router.delete('/:propertyId', authMiddleware, isAdmin, propertyController.deleteProperty);

// Property categorization routes
router.get('/properties', authMiddleware, isAdmin, propertyController.getAllPropertiesForAdmin);
router.patch('/properties/:propertyId/categorize', authMiddleware, isAdmin, propertyController.updatePropertyCategorization);
router.patch('/properties/bulk-categorize', authMiddleware, isAdmin, propertyController.bulkUpdatePropertyCategorization);

module.exports = router;
