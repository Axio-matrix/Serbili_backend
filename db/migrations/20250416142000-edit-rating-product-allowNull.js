'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.changeColumn('Products', 'rating', {
      type: Sequelize.FLOAT,
      allowNull: true,
      validate:{
        min: 1,
        max: 5,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.changeColumn('Products', 'rating', {
      type: Sequelize.FLOAT,
      allowNull: false,
    });
  }
};
