'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('Products', 'category', {
      type: Sequelize.STRING,
      allowNull: false
    });
    queryInterface.addColumn('Products', 'description', {
      type: Sequelize.STRING,
      allowNull: false
    });
    queryInterface.addColumn('Products', 'rating', {
      type: Sequelize.FLOAT,
      allowNull: false
    });
    queryInterface.addColumn('Products', 'color', {
      type: Sequelize.STRING,
      allowNull: true
    });
    queryInterface.addColumn('Products', 'size', {
      type: Sequelize.STRING,
      allowNull: true
    });
    queryInterface.addColumn('CartItems', 'size', {
      type: Sequelize.STRING,
      allowNull: true
    });
    queryInterface.addColumn('CartItems', 'color', {
      type: Sequelize.STRING,
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Products', 'category');
    queryInterface.removeColumn('Products', 'description');
    queryInterface.removeColumn('Products', 'rating');
    queryInterface.removeColumn('Products', 'color');
    queryInterface.removeColumn('Products', 'size');
    queryInterface.removeColumn('CartItems', 'size');
    queryInterface.removeColumn('CartItems', 'color');
  }
};