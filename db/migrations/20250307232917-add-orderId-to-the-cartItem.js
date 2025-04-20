'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('CartItems', 'orderId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Orders',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });
    queryInterface.changeColumn('CartItems', 'cartId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('CartItems', 'orderId');
    queryInterface.changeColumn('CartItems', 'cartId', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  }

};
