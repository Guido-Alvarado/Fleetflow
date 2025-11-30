import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Truck, 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp 
} from 'lucide-react';
import { getRepartos, getChoferes, getClientes } from '../services/firestore';
import { TableSkeleton, CardSkeleton } from '../components/Skeleton';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    repartosHoy: 0,
    repartosEnCurso: 0,
    entregasPendientes: 0,
    choferesActivos: 0,
    totalChoferes: 0,
    totalClientes: 0,
    totalACobrar: 0
  });
  const [recentRepartos, setRecentRepartos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repartosData, choferesData, clientesData] = await Promise.all([
          getRepartos(),
          getChoferes(),
          getClientes()
        ]);

        // Calculate stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const isSameDay = (date1, date2) => {
            if (!date1) return false;
            const d1 = date1.toDate ? date1.toDate() : new Date(date1);
            const d2 = date2.toDate ? date2.toDate() : new Date(date2);
            return d1.getDate() === d2.getDate() &&
                   d1.getMonth() === d2.getMonth() &&
                   d1.getFullYear() === d2.getFullYear();
        };

        const repartosHoyCount = repartosData.filter(r => r.Fecha && isSameDay(r.Fecha, today)).length;
        const repartosEnCursoCount = repartosData.filter(r => r.estado_global === 'EN_CURSO').length;
        const entregasPendientesCount = repartosData.filter(r => r.estado_global === 'PENDIENTE').length;
        
        // Active choferes: those assigned to active repartos (PENDIENTE or EN_CURSO)
        const activeChoferIds = new Set(
            repartosData
                .filter(r => ['PENDIENTE', 'EN_CURSO'].includes(r.estado_global))
                .map(r => r.IdChofer)
                .filter(Boolean)
        );
        const choferesActivosCount = activeChoferIds.size;

        const totalACobrarSum = repartosData
            .filter(r => ['PENDIENTE', 'EN_CURSO'].includes(r.estado_global))
            .reduce((sum, r) => sum + (r.TotalReparto || 0), 0);

        setStats({
          repartosHoy: repartosHoyCount,
          repartosEnCurso: repartosEnCursoCount,
          entregasPendientes: entregasPendientesCount,
          choferesActivos: choferesActivosCount,
          totalChoferes: choferesData.length,
          totalClientes: clientesData.length,
          totalACobrar: totalACobrarSum
        });

        // Recent repartos (already sorted by desc date in getRepartos)
        setRecentRepartos(repartosData.slice(0, 5));

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      PENDIENTE: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
      EN_CURSO: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
      FINALIZADO: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
    };
    return badges[estado] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <CardSkeleton count={6} />
        <div>
           <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
           <TableSkeleton rows={5} columns={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Resumen de operaciones • {new Date().toLocaleDateString('es-AR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Repartos Hoy */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Repartos Hoy</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.repartosHoy}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Programados para hoy</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Repartos en Curso */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">En Curso</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{stats.repartosEnCurso}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Rutas activas</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Entregas Pendientes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Entregas Pendientes</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">{stats.entregasPendientes}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Por completar</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Choferes Activos */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Choferes</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.choferesActivos}/{stats.totalChoferes}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Disponibles / Total</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Total Clientes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Clientes</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalClientes}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">En la base de datos</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Total a Cobrar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total a Cobrar</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                ${stats.totalACobrar.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Repartos activos</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Repartos Recientes */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Repartos Recientes</h2>
            <button
              onClick={() => navigate('/admin/repartos')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              Ver todos →
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Chofer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Vehículo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Entregas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentRepartos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No hay repartos registrados
                  </td>
                </tr>
              ) : (
                recentRepartos.map((reparto) => (
                  <tr 
                    key={reparto.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => navigate(`/admin/repartos/${reparto.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(reparto.Fecha)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {reparto.chofer?.nombre || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {reparto.flota?.patente || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {reparto.CantidadReparto || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      ${reparto.TotalReparto?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoBadge(reparto.estado_global)}`}>
                        {reparto.estado_global || 'PENDIENTE'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/admin/repartos/nuevo')}
          className="bg-blue-600 dark:bg-blue-700 text-white p-6 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors shadow-md text-left"
        >
          <Truck className="w-8 h-8 mb-3" />
          <h3 className="font-semibold text-lg">Nuevo Reparto</h3>
          <p className="text-sm text-blue-100 dark:text-blue-200 mt-1">Crear una nueva ruta de entrega</p>
        </button>

        <button
          onClick={() => navigate('/admin/choferes')}
          className="bg-green-600 dark:bg-green-700 text-white p-6 rounded-xl hover:bg-green-700 dark:hover:bg-green-800 transition-colors shadow-md text-left"
        >
          <Users className="w-8 h-8 mb-3" />
          <h3 className="font-semibold text-lg">Gestionar Choferes</h3>
          <p className="text-sm text-green-100 dark:text-green-200 mt-1">Ver y administrar choferes</p>
        </button>

        <button
          onClick={() => navigate('/admin/clientes')}
          className="bg-purple-600 dark:bg-purple-700 text-white p-6 rounded-xl hover:bg-purple-700 dark:hover:bg-purple-800 transition-colors shadow-md text-left"
        >
          <TrendingUp className="w-8 h-8 mb-3" />
          <h3 className="font-semibold text-lg">Gestionar Clientes</h3>
          <p className="text-sm text-purple-100 dark:text-purple-200 mt-1">Ver y administrar clientes</p>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
