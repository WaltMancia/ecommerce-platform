'use strict';

// Unsplash Source da imágenes gratuitas por categoría
// El formato es: https://source.unsplash.com/800x800/?{keyword}
// Para producción usamos URLs fijas y confiables de Unsplash
const products = [
    {
        category_id: 1,
        name: 'Wireless Headphones Pro',
        slug: 'wireless-headphones-pro',
        description: 'Audífonos inalámbricos con cancelación de ruido activa y 30 horas de batería.',
        price: 99.99,
        stock: 50,
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
        is_active: true,
    },
    {
        category_id: 1,
        name: 'Smartwatch Series X',
        slug: 'smartwatch-series-x',
        description: 'Reloj inteligente con monitoreo de salud, GPS y pantalla AMOLED.',
        price: 249.99,
        stock: 30,
        image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
        is_active: true,
    },
    {
        category_id: 1,
        name: 'Mechanical Keyboard RGB',
        slug: 'mechanical-keyboard-rgb',
        description: 'Teclado mecánico con switches Blue, retroiluminación RGB y diseño compacto.',
        price: 79.99,
        stock: 25,
        image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=800&fit=crop',
        is_active: true,
    },
    {
        category_id: 2,
        name: 'Classic White Sneakers',
        slug: 'classic-white-sneakers',
        description: 'Zapatillas blancas minimalistas, cómodas para uso diario.',
        price: 59.99,
        stock: 100,
        image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
        is_active: true,
    },
    {
        category_id: 2,
        name: 'Denim Jacket',
        slug: 'denim-jacket',
        description: 'Chaqueta de mezclilla clásica, corte regular, tallas S a XXL.',
        price: 49.99,
        stock: 75,
        image_url: 'https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=800&h=800&fit=crop',
        is_active: true,
    },
    {
        category_id: 3,
        name: 'Clean Code — Robert Martin',
        slug: 'clean-code-robert-martin',
        description: 'El libro esencial sobre escritura de código limpio y buenas prácticas.',
        price: 29.99,
        stock: 40,
        image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=800&fit=crop',
        is_active: true,
    },
];

module.exports = {
    async up(queryInterface) {
        const [results] = await queryInterface.sequelize.query(
            'SELECT COUNT(*) as count FROM products'
        );
        if (results[0].count > 0) return; // Ya hay productos, no insertamos

        await queryInterface.bulkInsert('products', products.map(p => ({
            ...p,
            created_at: new Date(),
            updated_at: new Date(),
        })));
    },
};