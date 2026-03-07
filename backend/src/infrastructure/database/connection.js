import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Instancia única de conexión (patrón Singleton implícito)
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false,
    }
);

// Función para probar la conexión al iniciar el servidor
export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1); // Si no hay BD, el servidor no debe arrancar
    }
};

export default sequelize;