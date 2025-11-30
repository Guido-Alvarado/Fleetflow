import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Choferes from './pages/Choferes';
import Flota from './pages/Flota';
import Clientes from './pages/Clientes';
import Zonas from './pages/Zonas';
import Repartos from './pages/Repartos';
import RepartoBuilder from './pages/RepartoBuilder';
import ChoferHome from './pages/ChoferHome';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Ruta pública - Login */}
            <Route path="/login" element={<Login />} />
            
            {/* Rutas protegidas - Admin */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="repartos" element={<Repartos />} />
              <Route path="repartos/nuevo" element={<RepartoBuilder />} />
              <Route path="choferes" element={<Choferes />} />
              <Route path="flota" element={<Flota />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="zonas" element={<Zonas />} />
              <Route 
                path="settings" 
                element={
                  <div className="p-4 text-gray-900 dark:text-white">
                    Configuración (En construcción)
                  </div>
                } 
              />
            </Route>

            {/* Rutas protegidas - Chofer */}
            <Route 
              path="/chofer" 
              element={
                <ProtectedRoute>
                  <ChoferHome />
                </ProtectedRoute>
              } 
            />

            {/* Redirección por defecto */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Ruta 404 - Página no encontrada */}
            <Route 
              path="*" 
              element={
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Página no encontrada</p>
                    <a 
                      href="/login" 
                      className="btn-primary inline-block"
                    >
                      Volver al inicio
                    </a>
                  </div>
                </div>
              } 
            />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
