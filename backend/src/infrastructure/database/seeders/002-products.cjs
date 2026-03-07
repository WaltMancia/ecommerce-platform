'use strict';

module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert('products', [
            {
                category_id: 1,
                name: 'Wireless Headphones',
                slug: 'wireless-headphones',
                description: 'High quality wireless headphones with noise cancellation',
                price: 99.99,
                stock: 50,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                category_id: 2,
                name: 'Classic T-Shirt',
                slug: 'classic-t-shirt',
                description: 'Comfortable 100% cotton t-shirt',
                price: 19.99,
                stock: 200,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('products', null, {});
    },
};