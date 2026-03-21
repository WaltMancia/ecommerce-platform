import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';

// Wrapper que protege rutas privadas
// Si no hay usuario autenticado, redirige al login
const ProtectedRoute = ({ children }) => {
    const { user } = useAuthStore();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;