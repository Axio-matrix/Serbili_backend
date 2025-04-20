'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   queryInterface.addColumn('Orders', 'shippedAt', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null
   });
   queryInterface.addColumn('Orders', 'deliveredAt', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null
   });
   queryInterface.addColumn('Orders', 'canceledAt', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null
   });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Orders', 'shippedAt');
    queryInterface.removeColumn('Orders', 'deliveredAt');
    queryInterface.removeColumn('Orders', 'canceledAt');
  }
};
