import { Router } from 'express';
import {
    getProducts,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/product.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { createProductValidator, updateProductValidator } from '../middlewares/validators/product.validators.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = Router();

// Rutas públicas — cualquiera puede ver productos
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Rutas protegidas — solo admins pueden gestionar productos
// El orden importa: authenticate verifica token, authorize verifica rol,
// luego las validaciones, y finalmente el controller
router.post(
    '/',
    authenticate,
    authorize('admin'),
    createProductValidator,
    validate,
    createProduct
);

router.put(
    '/:id',
    authenticate,
    authorize('admin'),
    updateProductValidator,
    validate,
    updateProduct
);

router.delete(
    '/:id',
    authenticate,
    authorize('admin'),
    deleteProduct
);

export default router;