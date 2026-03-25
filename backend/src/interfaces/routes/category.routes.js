import { Router } from 'express';
import { findAllCategories } from '../../infrastructure/repositories/category.repository.js';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const categories = await findAllCategories();
        res.json(categories);
    } catch (error) {
        next(error);
    }
});

export default router;