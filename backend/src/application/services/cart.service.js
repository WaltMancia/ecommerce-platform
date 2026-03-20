import * as cartRepository from '../../infrastructure/repositories/cart.repository.js';
import * as productRepository from '../../infrastructure/repositories/product.repository.js';
import { cartDTO } from '../dtos/cart.dto.js';

export const getCartService = async (userId) => {
    const cart = await cartRepository.findOrCreateCart(userId);
    return cartDTO(cart);
};

export const addToCartService = async (userId, { productId, quantity = 1 }) => {
    // Verificamos que el producto existe y tiene stock suficiente
    const product = await productRepository.findProductById(productId);
    if (!product || !product.is_active) {
        const error = new Error('Producto no encontrado');
        error.statusCode = 404;
        throw error;
    }

    if (product.stock < quantity) {
        const error = new Error(`Stock insuficiente. Disponible: ${product.stock}`);
        error.statusCode = 400;
        throw error;
    }

    const cart = await cartRepository.findOrCreateCart(userId);

    // Si el producto ya está en el carrito, sumamos la cantidad
    const existingItem = await cartRepository.findCartItem(cart.id, productId);

    if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        if (newQuantity > product.stock) {
            const error = new Error(`Stock insuficiente. Disponible: ${product.stock}`);
            error.statusCode = 400;
            throw error;
        }

        await cartRepository.updateCartItem(existingItem.id, newQuantity);
    } else {
        await cartRepository.addCartItem(cart.id, productId, quantity);
    }

    const updatedCart = await cartRepository.findOrCreateCart(userId);
    return cartDTO(updatedCart);
};

export const updateCartItemService = async (userId, itemId, { quantity }) => {
    const cart = await cartRepository.findOrCreateCart(userId);

    // Verificamos que el item pertenece al carrito del usuario
    const item = cart.items.find((i) => i.id === parseInt(itemId));
    if (!item) {
        const error = new Error('Item no encontrado en el carrito');
        error.statusCode = 404;
        throw error;
    }

    if (item.product.stock < quantity) {
        const error = new Error(`Stock insuficiente. Disponible: ${item.product.stock}`);
        error.statusCode = 400;
        throw error;
    }

    await cartRepository.updateCartItem(itemId, quantity);

    const updatedCart = await cartRepository.findOrCreateCart(userId);
    return cartDTO(updatedCart);
};

export const removeFromCartService = async (userId, itemId) => {
    const cart = await cartRepository.findOrCreateCart(userId);

    const item = cart.items.find((i) => i.id === parseInt(itemId));
    if (!item) {
        const error = new Error('Item no encontrado en el carrito');
        error.statusCode = 404;
        throw error;
    }

    await cartRepository.removeCartItem(itemId);

    const updatedCart = await cartRepository.findOrCreateCart(userId);
    return cartDTO(updatedCart);
};