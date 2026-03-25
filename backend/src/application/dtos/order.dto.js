export const orderDTO = (order) => ({
    id: order.id,
    status: order.status,
    total: parseFloat(order.total),
    stripePaymentId: order.stripe_payment_id,
    items: order.items
        ? order.items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            unitPrice: parseFloat(item.unit_price),
            subtotal: parseFloat((item.quantity * item.unit_price).toFixed(2)),
            product: item.product
                ? { id: item.product.id, name: item.product.name, imageUrl: item.product.imageUrl || null }
                : null,
        }))
        : [],
    createdAt: order.created_at,
});