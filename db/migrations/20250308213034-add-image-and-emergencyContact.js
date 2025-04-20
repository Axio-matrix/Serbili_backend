'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('Users', 'profileImage', {
      type: Sequelize.STRING,
      allowNull: true
    });
    queryInterface.addColumn('Users', 'emergencyContact', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'profileImage');
    queryInterface.removeColumn('Users', 'emergencyContact');
  }
};
