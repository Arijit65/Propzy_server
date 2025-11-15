const { User } = require('./models');
const bcrypt = require('bcrypt');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    console.log('🔄 Checking for admin user...');

    const adminEmail = process.env.ADMIN_USER || 'admin@propzy.com';
    const adminPassword = process.env.ADMIN_PASS || 'admin123';

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      where: {
        email: adminEmail,
        role: 'admin'
      }
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists:', adminEmail);
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = await User.create({
      email: adminEmail,
      password: hashedPassword,
      userName: 'Admin',
      role: 'admin',
      isVerified: true,
      isActive: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password:', adminPassword);
    console.log('⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdminUser();
