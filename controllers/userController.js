const { User, Enquiry, Property } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register new user
exports.register = async (req, res) => {
  try {
    const { email, password, userName, phone } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User with this email already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      userName: userName || email.split('@')[0],
      phone,
      role: 'user',
      isVerified: false,
      isActive: true
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      success: false,
      error: "Registration failed",
      details: err.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required"
      });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password"
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: "Account is deactivated. Please contact support."
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
        role: user.role,
        phone: user.phone,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      error: "Login failed",
      details: err.message
    });
  }
};

// Set username
exports.setUsername = async (req, res) => {
  try {
    const { userName } = req.body;
    const userId = req.user.id;

    if (!userName) {
      return res.status(400).json({
        success: false,
        error: "Username is required"
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    user.userName = userName;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Username updated successfully",
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Set username error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to update username",
      details: err.message
    });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'userName', 'role', 'phone', 'isVerified', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user",
      details: err.message
    });
  }
};

// ==================== ENQUIRY SUBMISSION (PUBLIC) ====================

// Submit Enquiry (Public - No Auth Required)
exports.submitEnquiry = async (req, res) => {
  try {
    console.log('📨 Enquiry Submission Request Received');
    console.log('Request Body:', JSON.stringify(req.body, null, 2));

    const {
      // Common fields
      name,
      email,
      phone,
      message,
      
      // Home page form fields
      enquiryType,
      location,
      
      // Property detail page form fields
      userType,
      reason,
      propertyId,
      
      // Source of enquiry
      source
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and phone are required fields"
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format"
      });
    }

    // If propertyId is provided, verify it exists
    if (propertyId) {
      const property = await Property.findByPk(propertyId);
      if (!property) {
        return res.status(404).json({
          success: false,
          error: "Property not found"
        });
      }
    }

    // Determine source if not provided
    let enquirySource = source || 'other';
    if (enquiryType && !propertyId) {
      enquirySource = 'home';
    } else if (propertyId) {
      enquirySource = 'property_detail';
    }

    // Create enquiry
    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      message,
      enquiryType,
      location,
      userType,
      reason,
      propertyId: propertyId || null,
      source: enquirySource,
      status: 'pending'
    });

    console.log('✅ Enquiry created successfully:', enquiry.id);

    res.status(201).json({
      success: true,
      message: "Thank you for your enquiry! We will get back to you soon.",
      enquiry: {
        id: enquiry.id,
        name: enquiry.name,
        email: enquiry.email,
        status: enquiry.status,
        createdAt: enquiry.createdAt
      }
    });
  } catch (err) {
    console.error('❌ Enquiry submission error:');
    console.error('Error Message:', err.message);
    console.error('Error Stack:', err.stack);
    if (err.errors) {
      console.error('Validation Errors:', err.errors);
    }
    res.status(500).json({
      success: false,
      error: "Failed to submit enquiry",
      details: err.message,
      validationErrors: err.errors
    });
  }
};
