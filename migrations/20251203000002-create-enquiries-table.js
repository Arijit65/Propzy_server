'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Enquiries', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      // Common fields
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      // Home page form fields
      enquiryType: {
        type: Sequelize.ENUM('buy', 'sell', 'rent'),
        allowNull: true
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      // Property detail page form fields
      userType: {
        type: Sequelize.ENUM('Individual', 'Dealer'),
        allowNull: true
      },
      reason: {
        type: Sequelize.ENUM('Investment', 'Self Use'),
        allowNull: true
      },
      propertyId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Properties',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      // System fields
      source: {
        type: Sequelize.ENUM('home', 'property_detail', 'other'),
        defaultValue: 'home',
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'contacted', 'resolved', 'closed'),
        defaultValue: 'pending',
        allowNull: false
      },
      adminNotes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      contactedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      resolvedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Add indexes
    await queryInterface.addIndex('Enquiries', ['status']);
    await queryInterface.addIndex('Enquiries', ['source']);
    await queryInterface.addIndex('Enquiries', ['propertyId']);
    await queryInterface.addIndex('Enquiries', ['createdAt']);
    await queryInterface.addIndex('Enquiries', ['email']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Enquiries');
  }
};
