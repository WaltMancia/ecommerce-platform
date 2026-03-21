import api from './api.js';

export const getCartService = async () => {
    const { data } = await api.get('/cart');
    return data;
};

export const addToCartService = async (productId, quantity = 1) => {
    const { data } = await api.post('/cart/items', { productId, quantity });
    return data;
};

export const updateCartItemService = async (itemId, quantity) => {
    const { data } = await api.put(`/cart/items/${itemId}`, { quantity });
    return data;
};

export const removeFromCartService = async (itemId) => {
    const { data } = await api.delete(`/cart/items/${itemId}`);
    return data;
};