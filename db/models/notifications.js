const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Notifications extends Model {
        static associate(models) {
            // define association here
            Notifications.belongsTo(models.Users, { foreignKey: 'userId', as: 'user' });
        }
    }

    Notifications.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    }, {
        sequelize,
        modelName: 'Notification',
        tableName: 'Notifications',
        timestamps: true, // createdAt & updatedAt
    });

    return Notifications;
}