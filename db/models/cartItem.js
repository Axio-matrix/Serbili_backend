const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class CartItem extends Model {
        static associate(models) {
            CartItem.belongsTo(models.Cart, { foreignKey: 'cartId', as: 'cart' });
            CartItem.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
        }
    }
    CartItem.init({
        cartId:{
            type: DataTypes.INTEGER,
            allowNull:false
        },
        productId:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        quantity:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },

        size: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        color: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        }
    },
        {
            sequelize,
            modelName: 'CartItem',
            tableName: 'CartItems',
        },
        
    );
    return CartItem;
}