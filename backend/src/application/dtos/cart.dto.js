export const cartDTO = (cart) => ({
    id: cart.id,
    items: cart.items
        ? cart.items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            product: {
                id: item.product.id,
                name: item.product.name,
                slug: item.product.slug,
                price: parseFloat(item.product.price),
                stock: item.product.stock,
            },
            // Calculamos el subtotal por item directamente en el DTO
            subtotal: parseFloat((item.quantity * item.product.price).toFixed(2)),
        }))
        : [],
    // Total del carrito: suma de todos los subtotales
    total: cart.items
        ? parseFloat(
            cart.items
                .reduce((sum, item) => sum + item.quantity * item.product.price, 0)
                .toFixed(2)
        )
        : 0,
});