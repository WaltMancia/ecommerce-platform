'use strict';

module.exports = {
    async up(queryInterface) {
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