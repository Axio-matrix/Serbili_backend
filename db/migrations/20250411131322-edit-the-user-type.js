'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Change the column type to TEXT temporarily
    await queryInterface.changeColumn('Users', 'userType', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // 2. Drop the old ENUM type
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Users_userType";');

    // 3. Change the column type to new ENUM
    return queryInterface.changeColumn('Users', 'userType', {
      type: Sequelize.ENUM('admin', 'shop', 'warehouse'),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Rollback: convert to STRING first
    await queryInterface.changeColumn('Users', 'userType', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Drop the new ENUM type
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Users_userType";');

    // Recreate the old ENUM
    return queryInterface.changeColumn('Users', 'userType', {
      type: Sequelize.ENUM('admin', 'worker', 'costumer'),
      allowNull: false,
    });
  },
};
