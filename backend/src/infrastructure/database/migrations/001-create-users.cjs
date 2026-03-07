'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING(150),
                allowNull: false,
                unique: true,        // No puede haber dos emails iguales
            },
            password: {
                type: Sequelize.STRING(255),
                allowNull: false,    // Aquí guardaremos el hash, nunca texto plano
            },
            role: {
                type: Sequelize.ENUM('customer', 'admin'),
                defaultValue: 'customer',
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,  // Soft delete: desactivamos en vez de borrar
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
        await queryInterface.dropTable('users');
    },
};