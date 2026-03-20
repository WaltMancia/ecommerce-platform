import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './interfaces/routes/auth.routes.js';
import productRoutes from './interfaces/routes/product.routes.js';
import cartRoutes from './interfaces/routes/cart.routes.js';
import orderRoutes from './interfaces/routes/order.routes.js';
import paymentRoutes from './interfaces/routes/payment.routes.js';
import { errorHandler } from './interfaces/middlewares/error.middleware.js';

dotenv.config();

const app = express();

// Middlewares globales
app.use(cors());

// Capturamos el rawBody ANTES de que express.json() lo procese
// Solo para la ruta del webhook de Stripe
app.use((req, res, next) => {
    if (req.originalUrl === '/api/v1/payments/webhook') {
        let data = '';
        req.on('data', (chunk) => { data += chunk; });
        req.on('end', () => {
            req.rawBody = data;
            next();
        });
    } else {
        express.json()(req, res, next);
    }
});

// Versionamiento de API: /api/v1 es la ruta base para todas las rutas de autenticación
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/payments', paymentRoutes);

// Health check 
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// El error handler SIEMPRE va al final, después de todas las rutas
app.use(errorHandler);

export default app;