'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Properties', 'isFeatured', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });

    await queryInterface.addColumn('Properties', 'isTopPick', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });

    await queryInterface.addColumn('Properties', 'isHighlighted', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });

    await queryInterface.addColumn('Properties', 'isInvestmentProperty', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });

    await queryInterface.addColumn('Properties', 'isRecentlyAdded', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });

    await queryInterface.addColumn('Properties', 'priority', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
      comment: 'Higher numbers = higher priority in listings'
    });

    await queryInterface.addColumn('Properties', 'featuredUntil', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Featured properties expiry date'
    });

    await queryInterface.addColumn('Properties', 'tags', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: [],
      allowNull: false,
      comment: 'Custom tags for property categorization'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Properties', 'isFeatured');
    await queryInterface.removeColumn('Properties', 'isTopPick');
    await queryInterface.removeColumn('Properties', 'isHighlighted');
    await queryInterface.removeColumn('Properties', 'isInvestmentProperty');
    await queryInterface.removeColumn('Properties', 'isRecentlyAdded');
    await queryInterface.removeColumn('Properties', 'priority');
    await queryInterface.removeColumn('Properties', 'featuredUntil');
    await queryInterface.removeColumn('Properties', 'tags');
  }
};
