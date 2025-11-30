import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente para proteger rutas que requieren autenticación
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente hijo a renderizar si está autenticado
 * @param {string[]} props.allowedRoles - Array de roles permitidos (opcional)
 * @param {string} props.redirectTo - Ruta a la que redirigir si no está autenticado
 */
const ProtectedRoute = ({ children, allowedRoles = [], redirectTo = '/login' }) => {
  const { user, loading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si se especificaron roles permitidos, verificar el rol del usuario
  // (Esta verificación se puede mejorar consultando Firestore)
  if (allowedRoles.length > 0) {
    // Por ahora, permitimos el acceso si hay usuario
    // En una implementación más robusta, deberías verificar el rol en Firestore
    return children;
  }

  // Usuario autenticado, renderizar el componente hijo
  return children;
};

export default ProtectedRoute;
