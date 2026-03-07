import { body } from 'express-validator';

export const createProductValidator = [
    body('name')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ max: 200 }).withMessage('El nombre no puede superar 200 caracteres'),

    body('price')
        .notEmpty().withMessage('El precio es obligatorio')
        .isFloat({ min: 0.01 }).withMessage('El precio debe ser mayor a 0'),

    body('stock')
        .optional()
        .isInt({ min: 0 }).withMessage('El stock no puede ser negativo'),

    body('category_id')
        .notEmpty().withMessage('La categoría es obligatoria')
        .isInt().withMessage('La categoría debe ser un número entero'),
];

export const updateProductValidator = [
    // optional() permite que el campo no venga en el body
    // pero si viene, debe cumplir la validación
    body('name')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('El nombre no puede superar 200 caracteres'),

    body('price')
        .optional()
        .isFloat({ min: 0.01 }).withMessage('El precio debe ser mayor a 0'),

    body('stock')
        .optional()
        .isInt({ min: 0 }).withMessage('El stock no puede ser negativo'),
];