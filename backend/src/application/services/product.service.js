import * as productRepository from '../../infrastructure/repositories/product.repository.js';
import { generateSlug } from '../../infrastructure/utils/slug.utils.js';
import {
    productListDTO,
    productDetailDTO,
    paginatedResponseDTO,
} from '../dtos/product.dto.js';

export const getProductsService = async ({ page = 1, limit = 10, search, categoryId }) => {
    // Calculamos el offset: si estamos en página 3 con limit 10
    // debemos saltarnos los primeros 20 registros (3-1)*10
    const offset = (page - 1) * limit;

    const { count, rows } = await productRepository.findAllProducts({
        limit: parseInt(limit),
        offset,
        search,
        categoryId,
    });

    const products = rows.map(productListDTO);
    return paginatedResponseDTO(products, count, page, limit);
};

export const getProductBySlugService = async (slug) => {
    const product = await productRepository.findProductBySlug(slug);

    if (!product) {
        const error = new Error('Producto no encontrado');
        error.statusCode = 404;
        throw error;
    }

    return productDetailDTO(product);
};

export const createProductService = async (productData) => {
    const slug = generateSlug(productData.name);

    // Verificamos que no exista ya un producto con ese slug
    const existing = await productRepository.findProductBySlug(slug);
    if (existing) {
        const error = new Error('Ya existe un producto con ese nombre');
        error.statusCode = 409;
        throw error;
    }

    const product = await productRepository.createProduct({
        ...productData,
        slug,
    });

    // Recargamos con la categoría incluida para devolver el DTO completo
    const productWithCategory = await productRepository.findProductById(product.id);
    return productDetailDTO(productWithCategory);
};

export const updateProductService = async (id, productData) => {
    const product = await productRepository.findProductById(id);
    if (!product) {
        const error = new Error('Producto no encontrado');
        error.statusCode = 404;
        throw error;
    }

    // Si cambia el nombre, regeneramos el slug
    if (productData.name) {
        productData.slug = generateSlug(productData.name);

        // Verificamos que el nuevo slug no lo use otro producto
        const slugExists = await productRepository.findProductBySlugExcludingId(
            productData.slug,
            id
        );
        if (slugExists) {
            const error = new Error('Ya existe un producto con ese nombre');
            error.statusCode = 409;
            throw error;
        }
    }

    const updated = await productRepository.updateProduct(id, productData);
    return productDetailDTO(updated);
};

export const deleteProductService = async (id) => {
    const product = await productRepository.findProductById(id);
    if (!product) {
        const error = new Error('Producto no encontrado');
        error.statusCode = 404;
        throw error;
    }

    await productRepository.deleteProduct(id);
};