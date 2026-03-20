import { Router } from 'express';
import { createPaymentIntent, handleWebhook } from '../controllers/payment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// El webhook NO lleva authenticate porque lo llama Stripe, no el usuario
// Su seguridad viene de la verificación de firma con el webhook secret
router.post('/webhook', handleWebhook);

// Esta sí requiere usuario autenticado
router.post('/create-intent', authenticate, createPaymentIntent);

export default router;