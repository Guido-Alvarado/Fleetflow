import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { seedDatabase } from '../utils/seedDatabase';
import { Moon, Sun, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const { login, register, loginWithGoogle, user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [seeding, setSeeding] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);

  // Redirigir si ya está logueado
  useEffect(() => {
    if (user && !verifying) {
      checkUserRoleAndRedirect(user);
    }
  }, [user, navigate, verifying]);

  const checkUserRoleAndRedirect = async (currentUser) => {
    // Si estamos verificando (login con Google), no redirigir automáticamente
    if (verifying) return;

    try {
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      const { db } = await import('../firebase/config');
      
      // Si es el admin principal
      if (currentUser.email === 'guidoalvarado10@gmail.com') {
        navigate('/admin', { replace: true });
        return;
      }

      // Verificar si es chofer
      const choferesRef = collection(db, 'choferes');
      const q = query(choferesRef, where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        navigate('/chofer', { replace: true });
      } else {
        // Si no es admin ni chofer, y ya está logueado (persistencia), podría ser un usuario normal
        // Pero si queremos restringir estricto:
        // navigate('/admin', { replace: true }); // Por defecto a admin si no es chofer (comportamiento anterior)
      }
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const handleGoogleLogin = async () => {
    setVerifying(true);
    setError('');
    try {
      const result = await loginWithGoogle();
      const user = result.user;

      // 1. Verificar si es el administrador principal
      if (user.email === 'guidoalvarado10@gmail.com') {
        navigate('/admin');
        return;
      }

      // 2. Verificar si es un chofer registrado
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      const { db } = await import('../firebase/config');
      
      const choferesRef = collection(db, 'choferes');
      const q = query(choferesRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Es un chofer registrado
        navigate('/chofer');
      } else {
        // 3. No es ni admin ni chofer -> No autorizado
        await logout(); // Cerrar sesión inmediatamente
        setShowUnauthorizedModal(true);
      }

    } catch (error) {
      console.error('Error with Google login:', error);
      setError('Error al iniciar sesión con Google');
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let userCredential;
      if (isRegistering) {
        userCredential = await register(email, password);
      } else {
        userCredential = await login(email, password);
      }

      // Verificar el rol del usuario en Firestore
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      const { db } = await import('../firebase/config');
      
      // Buscar en la colección de choferes si existe un documento con este userId
      const choferesRef = collection(db, 'choferes');
      const q = query(choferesRef, where('userId', '==', userCredential.user.uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Es un chofer
        navigate('/chofer');
      } else {
        // Es admin u otro rol
        navigate('/admin');
      }
    } catch (err) {
      console.error(err);
      let errorMessage = 'Ha ocurrido un error. Por favor intente nuevamente.';
      
      if (err.code === 'auth/weak-password') {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Este correo electrónico ya está registrado.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMessage = 'El inicio de sesión con correo y contraseña no está habilitado en Firebase Console.';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = 'Credenciales inválidas. Verifique su email y contraseña.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo electrónico no es válido.';
      }

      setError(errorMessage);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedDatabase();
      alert('Base de datos poblada con éxito!');
    } catch (error) {
      console.error(error);
      alert('Error al poblar la base de datos.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-3xl font-bold">F</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          FleetFlow
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Gestión inteligente de logística
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200 dark:border-gray-700">
          
          {/* Theme Toggle */}
          <div className="absolute top-4 right-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full btn-primary"
                disabled={verifying}
              >
                {isRegistering ? 'Registrarse' : 'Ingresar'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  O
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                disabled={verifying}
              >
                {isRegistering ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'}
              </button>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={verifying}
                className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verifying ? (
                  <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                {verifying ? 'Verificando...' : 'Continuar con Google'}
              </button>

              <button
                onClick={handleSeed}
                disabled={seeding || verifying}
                className="w-full inline-flex justify-center py-2 px-4 border border-green-300 dark:border-green-700 rounded-md shadow-sm bg-green-50 dark:bg-green-900/20 text-sm font-medium text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors disabled:opacity-50"
              >
                {seeding ? 'Poblando...' : 'Poblar DB (Seed)'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Cuenta No Registrada */}
      {showUnauthorizedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-sm w-full p-6 shadow-xl border border-gray-200 dark:border-gray-700 transform transition-all">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Cuenta sin registrar
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Esta cuenta de Google no tiene permisos de administrador ni está registrada como chofer.
              </p>
              <button
                onClick={() => setShowUnauthorizedModal(false)}
                className="w-full btn-primary"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
