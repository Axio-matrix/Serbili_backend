'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('Users', 'rating', {
      type: Sequelize.FLOAT,
      allowNull: true,
      validate:{
        min: 1,
        max: 5,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'rating');
  }
};
