import * as paymentService from '../../application/services/payment.service.js';

export const createPaymentIntent = async (req, res, next) => {
    try {
        const { orderId } = req.body;
        const result = await paymentService.createPaymentIntentService(
            req.user.userId,
            orderId
        );
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const handleWebhook = async (req, res, next) => {
    try {
        // req.rawBody es el body sin parsear — Stripe lo necesita así para verificar la firma
        // Si usas express.json() antes del webhook, la firma no coincide y falla
        const signature = req.headers['stripe-signature'];
        const result = await paymentService.handleWebhookService(req.rawBody, signature);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};