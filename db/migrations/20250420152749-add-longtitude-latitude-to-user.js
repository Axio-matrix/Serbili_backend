'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('Users', 'longitude', {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: null,
    });
    queryInterface.addColumn('Users', 'latitude', {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'longitude');
    queryInterface.removeColumn('Users', 'latitude');
  }
};
