const express = require('express');
const router = express.Router();
const { adminLogin } = require('../controllers/authController');
const { register, login } = require('../controllers/userController');

// User authentication routes
router.post('/register', register);
router.post('/login', login);

// Admin authentication routes
router.post('/admin/login', adminLogin);

module.exports = router;
