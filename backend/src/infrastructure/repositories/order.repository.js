import Order from '../database/models/Order.js';
import OrderItem from '../database/models/OrderItem.js';
import Product from '../database/models/Product.js';

const orderInclude = {
    model: OrderItem,
    as: 'items',
    include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'image_url'],
    }],
};

export const createOrder = async (orderData, items, transaction) => {
    // Pasamos la transacción a cada operación para que sean atómicas
    const order = await Order.create(orderData, { transaction });

    const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
    }));

    await OrderItem.bulkCreate(orderItems, { transaction });

    return order;
};

export const findOrdersByUser = async (userId) => {
    return await Order.findAll({
        where: { user_id: userId },
        include: [orderInclude],
        order: [['created_at', 'DESC']],
    });
};

export const findOrderById = async (id, userId) => {
    return await Order.findOne({
        where: { id, user_id: userId },
        include: [orderInclude],
    });
};

export const updateOrderStatus = async (stripePaymentId, status) => {
    await Order.update(
        { status },
        { where: { stripe_payment_id: stripePaymentId } }
    );
};

export const updateOrderPaymentId = async (orderId, stripePaymentId) => {
    await Order.update(
        { stripe_payment_id: stripePaymentId },
        { where: { id: orderId } }
    );
};