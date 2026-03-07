import * as productService from '../../application/services/product.service.js';

export const getProducts = async (req, res, next) => {
    try {
        // Los query params vienen como strings, el servicio maneja la conversión
        const { page, limit, search, categoryId } = req.query;
        const result = await productService.getProductsService({ page, limit, search, categoryId });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getProductBySlug = async (req, res, next) => {
    try {
        const result = await productService.getProductBySlugService(req.params.slug);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (req, res, next) => {
    try {
        const result = await productService.createProductService(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const result = await productService.updateProductService(req.params.id, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        await productService.deleteProductService(req.params.id);
        // 204 No Content: operación exitosa pero sin cuerpo de respuesta
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};