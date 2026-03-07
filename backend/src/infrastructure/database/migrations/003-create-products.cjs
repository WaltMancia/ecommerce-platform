'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('products', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            category_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'categories', // FK hacia categories
                    key: 'id',
                },
                onDelete: 'RESTRICT',  // No borres una categoría si tiene productos
                onUpdate: 'CASCADE',
            },
            name: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            slug: {
                type: Sequelize.STRING(200),
                allowNull: false,
                unique: true,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            price: {
                type: Sequelize.DECIMAL(10, 2), // 10 dígitos, 2 decimales. Ej: 99999999.99
                allowNull: false,
            },
            stock: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('products');
    },
};