const express = require('express');
const router = express.Router();
const { adminLogin } = require('../controllers/authController');

// Admin login route
router.post('/admin/login', adminLogin);

module.exports = router;
