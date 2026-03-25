'use strict';

module.exports = {
    async up(queryInterface) {
        // Verificamos si ya existen categorías antes de insertar
        const [results] = await queryInterface.sequelize.query(
            'SELECT COUNT(*) as count FROM categories'
        );
        const count = results[0].count;

        // Si ya hay datos, no hacemos nada — idempotencia
        if (count > 0) return;

        await queryInterface.bulkInsert('categories', [
            {
                name: 'Electronics',
                slug: 'electronics',
                description: 'Electronic devices and accessories',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Clothing',
                slug: 'clothing',
                description: 'Apparel and fashion items',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Books',
                slug: 'books',
                description: 'Physical and digital books',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('categories', null, {});
    },
};