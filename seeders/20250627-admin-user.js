'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    
    await queryInterface.bulkInsert('Users', [{
      email: 'admin@pmit.com',
      password: hashedPassword,
      role: 'admin',
      userName: 'admin',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    // Get the created admin user
    const adminUser = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE email = 'admin@pmit.com'`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (adminUser[0]) {
      // Create admin profile
      await queryInterface.bulkInsert('Profiles', [{
        userId: adminUser[0].id,
        name: 'Admin User',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove the admin profile first (due to foreign key constraint)
    await queryInterface.bulkDelete('Profiles', {
      userId: {
        [Sequelize.Op.in]: queryInterface.sequelize.literal(
          `(SELECT id FROM "Users" WHERE email = 'admin@pmit.com')`
        )
      }
    }, {});

    // Then remove the admin user
    await queryInterface.bulkDelete('Users', {
      email: 'admin@pmit.com'
    }, {});
  }
}; 