const { Model, DataTypes } = require('sequelize');


module.exports = (sequelize) => {
    class Cart extends Model {
        static associate(models) {
            Cart.belongsTo(models.Users, { foreignKey: 'userId', as: 'user' });
            Cart.hasMany(models.CartItem, { foreignKey: 'cartId', as: 'cartItems', onDelete: 'CASCADE' });
        }
    }
    Cart.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
        {
            sequelize,
            modelName: 'Cart',
            tableName: 'Carts',
        });

    return Cart;
}

