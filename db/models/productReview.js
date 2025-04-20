const { Model, DataTypes} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ReviewProduct extends Model {
        static associate(models) {
            ReviewProduct.belongsTo(models.Users, { foreignKey: 'shopId', as: 'user' });
            ReviewProduct.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
            
        }
    }
    ReviewProduct.init({
        shopId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        rating: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate:{
                min: 1,
                max: 5,
            }
        },
        
    }, {
        sequelize,
        modelName:'ReviewProduct',
        tableName:'ReviewProducts'
    })
    return ReviewProduct
}