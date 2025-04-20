'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('Users', 'paper', {
      type: Sequelize.TEXT,
      allowNull: false,
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'paper');
  }
};
