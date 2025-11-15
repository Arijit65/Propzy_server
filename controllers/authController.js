const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Admin login
exports.adminLogin = async (req, res) => {
  try {
    console.log('🔐 Admin Login Attempt');
    console.log('Request Body:', req.body);
    
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log('❌ Missing credentials');
      return res.status(400).json({
        success: false,
        error: "Email and password are required"
      });
    }

    // Find admin user
    const user = await User.findOne({
      where: {
        email,
        role: 'admin'
      }
    });

    console.log('👤 Admin user found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('❌ No admin found with email:', email);
      return res.status(401).json({
        success: false,
        error: "Invalid admin credentials"
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('🔑 Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password for admin:', email);
      return res.status(401).json({
        success: false,
        error: "Invalid admin credentials"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log('✅ Admin login successful for:', email);

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: user.id,
        email: user.email,
        userName: user.userName,
        role: user.role
      }
    });
  } catch (err) {
    console.error("❌ Admin login error:", err);
    res.status(500).json({
      success: false,
      error: "Login failed",
      details: err.message
    });
  }
};
