'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.removeColumn('CartItems', 'orderId')
  },

  async down (queryInterface, Sequelize) {
    queryInterface.addColumn('CartItems', 'orderId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Orders',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });
  }
};
