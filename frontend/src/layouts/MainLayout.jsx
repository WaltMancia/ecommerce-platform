import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

// Outlet renderiza el contenido de la ruta hija activa
// Es como un "slot" donde se inyectan las páginas
const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;