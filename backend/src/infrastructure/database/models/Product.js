import { DataTypes } from 'sequelize';
import sequelize from '../connection.js';
import Category from './Category.js';

const Product = sequelize.define(
    'Product',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        slug: {
            type: DataTypes.STRING(200),
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        // Añade este campo junto a los demás
        image_url: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
    },
    {
        tableName: 'products',
        underscored: true,
    }
);

// Definimos la asociación aquí mismo
// Esto le dice a Sequelize cómo hacer el JOIN entre tablas
// cuando usemos { include: Category } en una query
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });

export default Product;