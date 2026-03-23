import { Link } from 'react-router-dom';
import { ShoppingCart, Package, LogOut, User, LayoutDashboard } from 'lucide-react';
import useAuthStore from '../store/authStore.js';
import useCartStore from '../store/cartStore.js';
import useAuth from '../hooks/useAuth.js';

const Navbar = () => {
    const { user } = useAuthStore();
    const { itemCount } = useCartStore();
    const { handleLogout } = useAuth();

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 font-bold text-gray-900 text-lg">
                    <Package size={22} className="text-gray-700" />
                    Mi Tienda
                </Link>

                <div className="flex items-center gap-1">
                    <Link to="/productos" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
                        Productos
                    </Link>

                    {user ? (
                        <>
                            <Link to="/carrito" className="relative px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
                                <ShoppingCart size={20} />
                                {itemCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 bg-gray-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                                        {itemCount > 9 ? '9+' : itemCount}
                                    </span>
                                )}
                            </Link>

                            <Link to="/mis-ordenes" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-1.5">
                                <User size={15} />
                                Mis Órdenes
                            </Link>

                            {user.role === 'admin' && (
                                <Link to="/admin" className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-colors flex items-center gap-1.5">
                                    <LayoutDashboard size={15} />
                                    Admin
                                </Link>
                            )}

                            <button
                                onClick={handleLogout}
                                className="px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                title="Cerrar sesión"
                            >
                                <LogOut size={18} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
                                Iniciar sesión
                            </Link>
                            <Link to="/registro" className="px-4 py-2 text-sm bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors">
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