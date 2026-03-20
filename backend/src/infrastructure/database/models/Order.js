import { DataTypes } from 'sequelize';
import sequelize from '../connection.js';
import User from './User.js';

const Order = sequelize.define(
    'Order',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        status: {
            type: DataTypes.ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled'),
            defaultValue: 'pending',
        },
        total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        stripe_payment_id: { type: DataTypes.STRING(255), allowNull: true },
    },
    { tableName: 'orders', underscored: true }
);

Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });

export default Order;