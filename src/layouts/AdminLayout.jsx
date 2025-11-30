import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Truck, Users, Map, Settings, LogOut, Menu, X, ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Repartos', href: '/admin/repartos', icon: Truck },
    { name: 'Choferes', href: '/admin/choferes', icon: Users },
    { name: 'Flota', href: '/admin/flota', icon: Truck },
    { name: 'Clientes', href: '/admin/clientes', icon: Users },
    { name: 'Zonas', href: '/admin/zonas', icon: Map },
    { name: 'Configuración', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
      {/* Sidebar - Desktop: relative positioning, Mobile: fixed overlay */}
      <aside 
        className={`
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          transition-all duration-300 ease-in-out
          fixed lg:relative inset-y-0 left-0 z-50 h-full
          ${isSidebarOpen ? 'w-64' : '-translate-x-full lg:translate-x-0 lg:w-16'}
        `}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className={`h-16 flex items-center border-b border-gray-200 dark:border-gray-700 flex-shrink-0 ${isSidebarOpen ? 'justify-between px-4' : 'justify-center px-2'}`}>
            {isSidebarOpen && (
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                FleetFlow
              </span>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      flex items-center px-3 py-3 text-sm font-medium rounded-lg 
                      transition-all duration-200
                      ${isActive
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                      ${!isSidebarOpen && 'lg:justify-center'}
                    `}
                    title={!isSidebarOpen ? item.name : ''}
                  >
                    <Icon className={`
                      w-5 h-5 flex-shrink-0
                      ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}
                      ${isSidebarOpen ? 'mr-3' : ''}
                    `} />
                    <span className={`
                      whitespace-nowrap transition-all duration-300
                      ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 lg:hidden'}
                    `}>
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Theme Toggle & Logout */}
            <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 space-y-1">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`
                  flex items-center w-full px-3 py-2 text-sm font-medium 
                  text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700
                  transition-all duration-200
                  ${!isSidebarOpen && 'lg:justify-center'}
                `}
                title={!isSidebarOpen ? (isDarkMode ? 'Modo Claro' : 'Modo Oscuro') : ''}
              >
                {isDarkMode ? (
                  <Sun className={`w-5 h-5 flex-shrink-0 text-yellow-500 ${isSidebarOpen ? 'mr-3' : ''}`} />
                ) : (
                  <Moon className={`w-5 h-5 flex-shrink-0 text-gray-600 dark:text-gray-400 ${isSidebarOpen ? 'mr-3' : ''}`} />
                )}
                <span className={`
                  whitespace-nowrap transition-all duration-300
                  ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 lg:hidden'}
                `}>
                  {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
                </span>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`
                  flex items-center w-full px-3 py-2 text-sm font-medium 
                  text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20
                  transition-all duration-200
                  ${!isSidebarOpen && 'lg:justify-center'}
                `}
                title={!isSidebarOpen ? 'Cerrar Sesión' : ''}
              >
                <LogOut className={`w-5 h-5 flex-shrink-0 ${isSidebarOpen ? 'mr-3' : ''}`} />
                <span className={`
                  whitespace-nowrap transition-all duration-300
                  ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 lg:hidden'}
                `}>
                  Cerrar Sesión
                </span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content - Adapts to sidebar width */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Mobile Header */}
          <header className="lg:hidden h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 justify-between flex-shrink-0">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">FleetFlow</span>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50 dark:bg-gray-900">
            <Outlet />
          </main>
        </div>
      </div>
  );
};

export default AdminLayout;
