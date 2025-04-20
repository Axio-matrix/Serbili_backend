const { Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    class Product extends Model {
        static associate(models) {
            Product.hasMany(models.CartItem, { foreignKey: 'productId', as: 'cartItems' });
            Product.hasMany(models.ReviewProduct, { foreignKey: 'productId', as: 'productReviews' });
            Product.hasMany(models.OrderItem, { foreignKey: 'productId', as: 'orderItems' });
            Product.belongsTo(models.Users, { foreignKey: 'warehouseId', as: 'warehouse' });

        }
    }
    Product.init({
        name:{
            type: DataTypes.STRING,
            allowNull:false
        },
        price:{
            type: DataTypes.INTEGER,
            allowNull:false
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0, // Default: No stock available
            validate: {
                min: 0, // Stock can't be negative
            },
        },
        image:{
            type: DataTypes.TEXT,
            allowNull:false
        },
        category:{
            type: DataTypes.STRING,
            allowNull:false
        },
        description:{
            type: DataTypes.STRING,
            allowNull:false
        },
        rating:{
            type: DataTypes.FLOAT,
            allowNull:true,
            validate:{
                min: 1,
                max: 5,
            }
        },
        color:{
            type: DataTypes.STRING,
            allowNull:true,
            defaultValue: null,
        },
        size:{
            type: DataTypes.STRING,
            allowNull:true,
            defaultValue: null,
        },
        warehouseId: {
            type: DataTypes.INTEGER,
            allowNull: false,

        }
        
    },
    {
        sequelize,
        modelName:'Product',
        tableName:'Products'
    })
    return Product
}