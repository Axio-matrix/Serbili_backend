'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.changeColumn('Products', 'image', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
    queryInterface.changeColumn('Users', 'profileImage', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    queryInterface.changeColumn('Users', 'paper', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.changeColumn('Products', 'image', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    queryInterface.changeColumn('Users', 'profileImage', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    queryInterface.changeColumn('Users', 'paper', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};
