import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Plus } from 'lucide-react';
import AdminProductsPage from './AdminProductsPage.jsx';
import AdminProductFormPage from './AdminProductFormPage.jsx';
import { getProductsService } from '../../services/product.service.js';

const AdminPage = () => {
    const location = useLocation();

    const navItems = [
        { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
        { to: '/admin/productos', label: 'Productos', icon: Package },
    ];

    return (
        <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="w-56 flex-shrink-0">
                <div className="bg-white rounded-2xl border border-gray-100 p-4 sticky top-24">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                        Panel Admin
                    </p>
                    <nav className="space-y-1">
                        {navItems.map(({ to, label, icon: Icon, exact }) => {
                            const active = exact
                                ? location.pathname === to
                                : location.pathname.startsWith(to);
                            return (
                                <Link
                                    key={to}
                                    to={to}
                                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${active
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon size={16} />
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* Contenido */}
            <div className="flex-1 min-w-0">
                <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/productos" element={<AdminProductsPage />} />
                    <Route path="/productos/nuevo" element={<AdminProductFormPage />} />
                    <Route path="/productos/editar/:id" element={<AdminProductFormPage />} />
                </Routes>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const [totalProducts, setTotalProducts] = useState(0);

    useEffect(() => {
        const fetchTotal = async () => {
            try {
                const data = await getProductsService({ limit: 999 });
                setTotalProducts(data.pagination?.total || data.data?.length || 0);
            } catch {
                setTotalProducts(0);
            }
        };
        fetchTotal();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total Productos', value: totalProducts, icon: Package, color: 'bg-blue-50 text-blue-600' },
                ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${color}`}>
                            <Icon size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{label}</p>
                            <p className="text-2xl font-bold text-gray-900">{value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminPage;