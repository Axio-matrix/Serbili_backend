const { Model, DataTypes} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class WarehouseReview extends Model {
        static associate(models) {
            WarehouseReview.belongsTo(models.Users, { foreignKey: 'shopId', as: 'shop' });
            WarehouseReview.belongsTo(models.Users, { foreignKey: 'warehouseId', as: 'warehouse' });
        }
    }
    WarehouseReview.init({
        shopId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        warehouseId: {
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
        modelName:'WarehouseReview',
        tableName:'WarehouseReviews'
    })
    return WarehouseReview
}