import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import useCartStore from '../store/cartStore.js';
import useAuth from '../hooks/useAuth.js';

const Navbar = () => {
    const { user } = useAuthStore();
    const { itemCount } = useCartStore();
    const { handleLogout } = useAuth();

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold text-gray-900">
                    🛍️ Mi Tienda
                </Link>

                <div className="flex items-center gap-6">
                    <Link to="/productos" className="text-gray-600 hover:text-gray-900">
                        Productos
                    </Link>

                    {user ? (
                        <>
                            <Link to="/carrito" className="relative text-gray-600 hover:text-gray-900">
                                🛒
                                {/* Badge con cantidad de items */}
                                {itemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>

                            <Link to="/mis-ordenes" className="text-gray-600 hover:text-gray-900">
                                Mis Órdenes
                            </Link>

                            {user.role === 'admin' && (
                                <Link to="/admin" className="text-blue-600 hover:text-blue-800 font-medium">
                                    Admin
                                </Link>
                            )}

                            <button
                                onClick={handleLogout}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-600 hover:text-gray-900">
                                Iniciar sesión
                            </Link>
                            <Link
                                to="/registro"
                                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                            >
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;