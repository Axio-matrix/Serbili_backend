const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.Users, { foreignKey: 'userId', as: 'user' });
            Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'orderItems' });
            Order.belongsTo(models.Users, { as: 'warehouse', foreignKey: 'warehouseId' });

        }
    }

    Order.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        totalAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELED'),
            allowNull: false,
            defaultValue: 'PENDING',
        },
        shippedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        deliveredAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        canceledAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        warehouseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isPaid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        paymentMethod: {
            type: DataTypes.ENUM('credit_card', 'cash_on_delivery'),
            allowNull: false,
            defaultValue: 'cash_on_delivery',
        }
    }, {
        sequelize,
        modelName: 'Order',
        tableName: 'Orders',
        timestamps: true, // createdAt & updatedAt
    });

    return Order;
};
