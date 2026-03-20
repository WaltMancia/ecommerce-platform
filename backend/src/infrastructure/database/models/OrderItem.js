import { DataTypes } from 'sequelize';
import sequelize from '../connection.js';
import Order from './Order.js';
import Product from './Product.js';

const OrderItem = sequelize.define(
    'OrderItem',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        order_id: { type: DataTypes.INTEGER, allowNull: false },
        product_id: { type: DataTypes.INTEGER, allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false },
        // Guardamos el precio en el momento de la compra
        // Si el producto cambia de precio después, la orden queda intacta
        unit_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    },
    { tableName: 'order_items', underscored: true }
);

OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });

export default OrderItem;