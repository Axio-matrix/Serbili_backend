'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.changeColumn('ReviewProducts', 'rating', {
      type: Sequelize.FLOAT,
      allowNull: false,
      validate:{
        min: 1,
        max: 5,
      }
    });
    queryInterface.changeColumn('WarehouseReviews', 'rating', {
      type: Sequelize.FLOAT,
      allowNull: false,
      validate:{
        min: 1,
        max: 5,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.changeColumn('ReviewProducts', 'rating', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    });
    queryInterface.changeColumn('WarehouseReviews', 'rating', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    });
  }
};
