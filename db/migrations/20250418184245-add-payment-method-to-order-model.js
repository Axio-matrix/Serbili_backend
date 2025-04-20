'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('Orders', 'paymentMethod', {
      type: Sequelize.ENUM('credit_card', 'cash_on_delivery'),
      allowNull: false,
      defaultValue: 'cash_on_delivery',
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Orders', 'paymentMethod');
  }
};
