'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('products', 'image_url', {
            type: Sequelize.STRING(500),
            allowNull: true,
            after: 'description', // MySQL: posición de la columna
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('products', 'image_url');
    },
};