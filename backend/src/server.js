import app from './app.js';
import { connectDB } from './infrastructure/database/connection.js';

const PORT = process.env.PORT || 3000;

// Conectamos BD antes de abrir el servidor
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
};

startServer();