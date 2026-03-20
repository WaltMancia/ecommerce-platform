import { DataTypes } from 'sequelize';
import sequelize from '../connection.js';
import Cart from './Cart.js';
import Product from './Product.js';

const CartItem = sequelize.define(
    'CartItem',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        cart_id: { type: DataTypes.INTEGER, allowNull: false },
        product_id: { type: DataTypes.INTEGER, allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    },
    { tableName: 'cart_items', underscored: true }
);

CartItem.belongsTo(Cart, { foreignKey: 'cart_id', as: 'cart' });
CartItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Cart.hasMany(CartItem, { foreignKey: 'cart_id', as: 'items' });

export default CartItem;