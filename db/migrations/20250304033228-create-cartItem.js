module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('CartItems', {
          id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.INTEGER,
          },
          cartId: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: {
                  model: 'Carts',
                  key: 'id',
              },
              onDelete: 'CASCADE',
          },
          productId: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: {
                  model: 'Products',
                  key: 'id',
              },
              onDelete: 'CASCADE',
          },
          quantity: {
              type: Sequelize.INTEGER,
              allowNull: false,
              defaultValue: 1,
          },
          createdAt: {
              allowNull: false,
              type: Sequelize.DATE,
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          updatedAt: {
              allowNull: false,
              type: Sequelize.DATE,
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('CartItems');
  },
};
