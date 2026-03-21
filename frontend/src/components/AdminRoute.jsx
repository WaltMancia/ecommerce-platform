import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';

// Solo deja pasar a usuarios con rol admin
const AdminRoute = ({ children }) => {
    const { user } = useAuthStore();

    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== 'admin') return <Navigate to="/" replace />;

    return children;
};

export default AdminRoute;