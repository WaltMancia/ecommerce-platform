import { DataTypes } from 'sequelize';
import sequelize from '../connection.js';
import User from './User.js';

const Cart = sequelize.define(
    'Cart',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: 'carts', underscored: true }
);

Cart.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(Cart, { foreignKey: 'user_id', as: 'cart' });

export default Cart;