import api from './api.js';

export const checkoutService = async () => {
    const { data } = await api.post('/orders/checkout');
    return data;
};

export const getMyOrdersService = async () => {
    const { data } = await api.get('/orders');
    return data;
};

export const getOrderByIdService = async (id) => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
};

export const createPaymentIntentService = async (orderId) => {
    const { data } = await api.post('/payments/create-intent', { orderId });
    return data;
};