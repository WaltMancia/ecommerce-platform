'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('orders', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' },
                onDelete: 'RESTRICT',
            },
            status: {
                type: Sequelize.ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled'),
                defaultValue: 'pending',
            },
            total: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            stripe_payment_id: {
                // Lo guardaremos cuando Stripe confirme el pago
                type: Sequelize.STRING(255),
                allowNull: true,
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
        await queryInterface.dropTable('orders');
    },
};