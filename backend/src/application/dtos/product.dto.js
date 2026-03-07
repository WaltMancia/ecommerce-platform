// DTO para listar productos (versión resumida)
export const productListDTO = (product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: parseFloat(product.price), // DECIMAL viene como string desde MySQL
    stock: product.stock,
    category: product.category
        ? { id: product.category.id, name: product.category.name }
        : null,
});

// DTO para detalle de un producto (versión completa)
export const productDetailDTO = (product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: parseFloat(product.price),
    stock: product.stock,
    isActive: product.is_active,
    category: product.category
        ? { id: product.category.id, name: product.category.name }
        : null,
    createdAt: product.created_at,
});

// DTO para respuesta paginada — reutilizable para cualquier entidad
export const paginatedResponseDTO = (data, total, page, limit) => ({
    data,
    pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
    },
});