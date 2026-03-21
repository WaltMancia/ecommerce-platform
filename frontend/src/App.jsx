import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';

// Páginas
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';

// Páginas pendientes — las crearemos en los siguientes pasos
// Por ahora usamos placeholders
const HomePage = () => <h1 className="text-2xl font-bold">Inicio — Próximamente</h1>;
const ProductsPage = () => <h1 className="text-2xl font-bold">Productos — Próximamente</h1>;
const CartPage = () => <h1 className="text-2xl font-bold">Carrito — Próximamente</h1>;
const OrdersPage = () => <h1 className="text-2xl font-bold">Órdenes — Próximamente</h1>;
const AdminPage = () => <h1 className="text-2xl font-bold">Admin — Próximamente</h1>;

const App = () => {
  return (
    <Routes>
      {/* Rutas públicas sin layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      {/* Rutas con layout (navbar + contenido) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/productos" element={<ProductsPage />} />

        {/* Rutas protegidas — requieren login */}
        <Route path="/carrito" element={
          <ProtectedRoute><CartPage /></ProtectedRoute>
        } />
        <Route path="/mis-ordenes" element={
          <ProtectedRoute><OrdersPage /></ProtectedRoute>
        } />

        {/* Rutas de admin — requieren rol admin */}
        <Route path="/admin/*" element={
          <AdminRoute><AdminPage /></AdminRoute>
        } />
      </Route>

      {/* Cualquier ruta desconocida redirige al inicio */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;