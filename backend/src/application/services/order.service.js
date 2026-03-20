import sequelize from '../../infrastructure/database/connection.js';
import * as cartRepository from '../../infrastructure/repositories/cart.repository.js';
import * as orderRepository from '../../infrastructure/repositories/order.repository.js';
import * as productRepository from '../../infrastructure/repositories/product.repository.js';
import { orderDTO } from '../dtos/order.dto.js';

export const checkoutService = async (userId) => {
    const cart = await cartRepository.findOrCreateCart(userId);

    if (!cart.items || cart.items.length === 0) {
        const error = new Error('El carrito está vacío');
        error.statusCode = 400;
        throw error;
    }

    // Calculamos el total y preparamos los items de la orden
    let total = 0;
    const orderItems = [];

    for (const item of cart.items) {
        // Verificamos stock actualizado en tiempo real
        // (pudo cambiar desde que se añadió al carrito)
        const product = await productRepository.findProductById(item.product_id);

        if (product.stock < item.quantity) {
            const error = new Error(
                `Stock insuficiente para "${product.name}". Disponible: ${product.stock}`
            );
            error.statusCode = 400;
            throw error;
        }

        total += item.quantity * parseFloat(item.product.price);
        orderItems.push({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: parseFloat(item.product.price),
        });
    }

    // Aquí empieza la transacción
    // Si cualquier operación falla, todo se revierte automáticamente
    const transaction = await sequelize.transaction();

    try {
        // 1. Crear la orden
        const order = await orderRepository.createOrder(
            { user_id: userId, total: total.toFixed(2), status: 'pending' },
            orderItems,
            transaction
        );

        // 2. Descontar stock de cada producto
        for (const item of cart.items) {
            const product = await productRepository.findProductById(item.product_id);
            await productRepository.updateProduct(
                item.product_id,
                { stock: product.stock - item.quantity },
                transaction // ← Aquí estaba el problema, faltaba pasar esto
            );
        }

        // 3. Vaciar el carrito
        await cartRepository.clearCart(cart.id);

        // Todo salió bien, confirmamos los cambios en BD
        await transaction.commit();

        const fullOrder = await orderRepository.findOrderById(order.id, userId);
        return orderDTO(fullOrder);
    } catch (error) {
        // Algo falló, revertimos todo
        await transaction.rollback();
        throw error;
    }
};

export const getMyOrdersService = async (userId) => {
    const orders = await orderRepository.findOrdersByUser(userId);
    return orders.map(orderDTO);
};

export const getOrderByIdService = async (userId, orderId) => {
    const order = await orderRepository.findOrderById(orderId, userId);

    if (!order) {
        const error = new Error('Orden no encontrada');
        error.statusCode = 404;
        throw error;
    }

    return orderDTO(order);
};