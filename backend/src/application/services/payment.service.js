import stripe from '../../infrastructure/utils/stripe.utils.js';
import * as orderRepository from '../../infrastructure/repositories/order.repository.js';

export const createPaymentIntentService = async (userId, orderId) => {
    // Buscamos la orden y verificamos que pertenece al usuario
    const order = await orderRepository.findOrderById(orderId, userId);

    if (!order) {
        const error = new Error('Orden no encontrada');
        error.statusCode = 404;
        throw error;
    }

    if (order.status !== 'pending') {
        const error = new Error('Esta orden ya fue procesada');
        error.statusCode = 400;
        throw error;
    }

    // Creamos el PaymentIntent en Stripe
    // amount va en centavos: $99.99 → 9999
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(order.total) * 100),
        currency: 'usd',
        metadata: {
            orderId: order.id.toString(),
            userId: userId.toString(),
        },
    });

    // Guardamos el paymentIntent.id en la orden para relacionarlos después
    await orderRepository.updateOrderPaymentId(orderId, paymentIntent.id);

    return {
        clientSecret: paymentIntent.client_secret,
        orderId: order.id,
        amount: parseFloat(order.total),
    };
};

export const handleWebhookService = async (payload, signature) => {
    let event;

    try {
        // Stripe firma cada webhook con tu secret para verificar que viene de ellos
        // Si alguien intenta falsificar un webhook, esta línea lanza un error
        event = stripe.webhooks.constructEvent(
            payload,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        const err = new Error(`Webhook inválido: ${error.message}`);
        err.statusCode = 400;
        throw err;
    }

    // Manejamos los eventos que nos interesan
    switch (event.type) {
        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object;
            await orderRepository.updateOrderStatus(paymentIntent.id, 'paid');
            console.log(`✅ Pago confirmado: ${paymentIntent.id}`);
            break;
        }

        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object;
            await orderRepository.updateOrderStatus(paymentIntent.id, 'cancelled');
            console.log(`❌ Pago fallido: ${paymentIntent.id}`);
            break;
        }

        // Stripe envía muchos tipos de eventos, ignoramos los que no necesitamos
        default:
            break;
    }

    return { received: true };
};