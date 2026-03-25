import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CloudinaryStorage sube la imagen directamente a Cloudinary
// sin guardarla temporalmente en tu servidor
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'ecommerce/products',     // Carpeta en tu cuenta de Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
            { width: 800, height: 800, crop: 'limit' }, // Máximo 800x800
            { quality: 'auto' },                         // Compresión automática
            { fetch_format: 'auto' },                    // Formato óptimo por navegador
        ],
    },
});

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Máximo 5MB
});

export default cloudinary;