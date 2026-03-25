import { Router } from 'express';
import {
    getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct,
} from '../controllers/product.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { createProductValidator, updateProductValidator } from '../middlewares/validators/product.validators.js';
import { validate } from '../middlewares/validate.middleware.js';
import { findProductById } from '../../infrastructure/repositories/product.repository.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestión de productos
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Listar productos con paginación y búsqueda
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: headphones
 *     responses:
 *       200:
 *         description: Lista paginada de productos
 */
router.get('/', getProducts);

/**
 * @swagger
 * /products/{slug}:
 *   get:
 *     summary: Obtener producto por slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: wireless-headphones
 *     responses:
 *       200:
 *         description: Detalle del producto
 *       404:
 *         description: Producto no encontrado
 */
router.get('/id/:id', async (req, res, next) => {
    try {
        const product = await findProductById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(product);
    } catch (error) {
        next(error);
    }
});

router.get('/:slug', getProductBySlug);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crear producto (solo admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, stock, category_id]
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Producto creado
 *       403:
 *         description: Sin permisos de admin
 */
router.post('/', authenticate, authorize('admin'), createProductValidator, validate, createProduct);
router.put('/:id', authenticate, authorize('admin'), updateProductValidator, validate, updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);
import { upload } from '../../infrastructure/utils/cloudinary.utils.js';

// Ruta para subir imagen de un producto (solo admin)
// El middleware upload.single('image') intercepta el archivo
// antes de llegar al controller
router.post(
    '/:id/image',
    authenticate,
    authorize('admin'),
    upload.single('image'),  // 'image' es el nombre del campo en el form
    async (req, res, next) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No se envió ninguna imagen' });
            }

            // req.file.path contiene la URL de Cloudinary tras la subida
            const updated = await import('../../infrastructure/repositories/product.repository.js')
                .then(m => m.updateProduct(req.params.id, { image_url: req.file.path }));

            res.json({ imageUrl: req.file.path, product: updated });
        } catch (error) {
            next(error);
        }
    }
);

export default router;