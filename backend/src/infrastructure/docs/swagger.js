import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-Commerce API',
            version: '1.0.0',
            description: 'API REST para plataforma de comercio electrónico',
        },
        servers: [
            {
                url: '/api/v1',
                description: 'Servidor de desarrollo',
            },
        ],
        // Definimos el esquema de seguridad JWT una sola vez
        // y lo referenciamos en cada endpoint protegido
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    // Le decimos a swagger-jsdoc dónde buscar los comentarios JSDoc
    apis: ['./src/interfaces/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);