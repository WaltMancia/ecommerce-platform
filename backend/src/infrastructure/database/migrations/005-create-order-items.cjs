'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('order_items', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            order_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'orders', key: 'id' },
                onDelete: 'CASCADE', // Si se borra la orden, se borran sus items
            },
            product_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'products', key: 'id' },
                onDelete: 'RESTRICT',
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            unit_price: {
                // Guardamos el precio AL MOMENTO de la compra
                // Si el producto cambia de precio, el historial queda intacto
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
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
        await queryInterface.dropTable('order_items');
    },
};