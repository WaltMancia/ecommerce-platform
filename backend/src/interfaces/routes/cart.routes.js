import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../controllers/cart.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Todas las rutas del carrito requieren autenticación
router.use(authenticate);

router.get('/', getCart);
router.post('/items', addToCart);
router.put('/items/:itemId', updateCartItem);
router.delete('/items/:itemId', removeFromCart);

export default router;