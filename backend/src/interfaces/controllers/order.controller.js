import * as orderService from '../../application/services/order.service.js';

export const checkout = async (req, res, next) => {
    try {
        const result = await orderService.checkoutService(req.user.userId);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const getMyOrders = async (req, res, next) => {
    try {
        const result = await orderService.getMyOrdersService(req.user.userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getOrderById = async (req, res, next) => {
    try {
        const result = await orderService.getOrderByIdService(
            req.user.userId,
            req.params.id
        );
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};