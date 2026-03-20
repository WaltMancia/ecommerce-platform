import * as cartService from '../../application/services/cart.service.js';

export const getCart = async (req, res, next) => {
    try {
        // req.user.userId viene del middleware authenticate
        const result = await cartService.getCartService(req.user.userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const addToCart = async (req, res, next) => {
    try {
        const result = await cartService.addToCartService(req.user.userId, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateCartItem = async (req, res, next) => {
    try {
        const result = await cartService.updateCartItemService(
            req.user.userId,
            req.params.itemId,
            req.body
        );
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const removeFromCart = async (req, res, next) => {
    try {
        const result = await cartService.removeFromCartService(
            req.user.userId,
            req.params.itemId
        );
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};