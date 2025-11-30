import { useState, useEffect } from 'react';
import { getRepartosByChofer, getChoferByUserId, updateItemStatus, addGastoRuta } from '../services/firestore';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Package, CheckCircle, XCircle, DollarSign, MapPin, Navigation, Plus, Moon, Sun, LogOut, Camera, X as XIcon, Truck, Receipt, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GastosView from '../components/GastosView';
import Skeleton from '../components/Skeleton';

const ChoferHome = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [repartos, setRepartos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReparto, setSelectedReparto] = useState(null);
  const [showGastoModal, setShowGastoModal] = useState(false);
  const [choferData, setChoferData] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [activeTab, setActiveTab] = useState('entregas');
  const [expandedItem, setExpandedItem] = useState(null); // Para cards colapsables
  const [gastoForm, setGastoForm] = useState({
    concepto: 'Combustible',
    monto: '',
    km_registrado: '',
    foto_url: ''
  });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const chofer = await getChoferByUserId(user.uid);
      if (chofer) {
        setChoferData(chofer);
        const repartosData = await getRepartosByChofer(chofer.id);
        setRepartos(repartosData);
        
        // Seleccionar el reparto activo (EN_CURSO) o el primero PENDIENTE
        const activo = repartosData.find(r => r.estado_global === 'EN_CURSO') || repartosData[0];
        setSelectedReparto(activo);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      try {
        await logout();
        navigate('/login');
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión');
      }
    }
  };

  const handleUpdateStatus = async (itemId, nuevoEstado, motivo = '') => {
    if (!selectedReparto) return;

    try {
      await updateItemStatus(selectedReparto.id, itemId, nuevoEstado, motivo);
      
      // Actualizar estado local
      const updatedItems = selectedReparto.items_entrega.map(item => 
        item.id === itemId ? { ...item, estado: nuevoEstado, motivo_fallo: motivo, hora_visita: new Date() } : item
      );
      
      setSelectedReparto({
        ...selectedReparto,
        items_entrega: updatedItems
      });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error al actualizar el estado');
    }
  };

  const handlePhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setGastoForm(prev => ({ ...prev, foto_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setGastoForm(prev => ({ ...prev, foto_url: '' }));
  };

  const handleAddGasto = async (e) => {
    e.preventDefault();
    if (!selectedReparto) return;

    try {
      const nuevoGasto = {
        ...gastoForm,
        monto: parseFloat(gastoForm.monto),
        km_registrado: gastoForm.km_registrado ? parseInt(gastoForm.km_registrado) : null,
        fecha_registro: new Date()
      };

      await addGastoRuta(selectedReparto.id, nuevoGasto);
      
      // Actualizar estado local
      const updatedGastos = [...(selectedReparto.gastos_ruta || []), nuevoGasto];
      setSelectedReparto({
        ...selectedReparto,
        gastos_ruta: updatedGastos
      });

      setShowGastoModal(false);
      setGastoForm({
        concepto: 'Combustible',
        monto: '',
        km_registrado: '',
        foto_url: ''
      });
      setPhotoPreview(null);
      alert('Gasto registrado exitosamente');
    } catch (error) {
      console.error('Error adding gasto:', error);
      alert('Error al agregar el gasto');
    }
  };

  const openGoogleMaps = (direccion) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`;
    window.open(url, '_blank');
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      PENDIENTE: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-400', label: 'Pendiente' },
      ENTREGADO: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-400', label: 'Entregado' },
      NO_ENTREGADO: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-400', label: 'No Entregado' }
    };
    return badges[estado] || badges.PENDIENTE;
  };

  const toggleItem = (itemId) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
        {/* Header Skeleton */}
        <div className="bg-blue-600 dark:bg-blue-800 p-4 shadow-lg">
          <div className="max-w-md mx-auto flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton variant="text" className="w-32 h-6 bg-blue-500 dark:bg-blue-700" />
              <Skeleton variant="text" className="w-48 h-4 bg-blue-500 dark:bg-blue-700" />
            </div>
            <div className="flex gap-2">
              <Skeleton variant="rect" className="w-9 h-9 bg-blue-500 dark:bg-blue-700" />
              <Skeleton variant="rect" className="w-9 h-9 bg-blue-500 dark:bg-blue-700" />
            </div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <Skeleton variant="text" className="w-8 h-8 mx-auto mb-1" />
                <Skeleton variant="text" className="w-16 h-3 mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Cards Skeleton */}
        <div className="max-w-md mx-auto px-4 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Skeleton variant="text" className="w-8 h-6" />
                  <Skeleton variant="rect" className="w-20 h-6 rounded-full" />
                </div>
                <Skeleton variant="text" className="w-16 h-6" />
              </div>
              <div className="p-4 space-y-3">
                <Skeleton variant="text" className="w-3/4 h-6" />
                <Skeleton variant="text" className="w-1/2 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!selectedReparto) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        {/* Header con logout */}
        <div className="bg-blue-600 dark:bg-blue-800 text-white p-4 shadow-lg">
          <div className="max-w-md mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Mi Ruta</h1>
            <div className="flex gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-blue-700 dark:bg-blue-900 hover:bg-blue-800 dark:hover:bg-blue-950 transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No hay repartos asignados</h2>
            <p className="text-gray-600 dark:text-gray-400">Contacta con tu supervisor para obtener una ruta</p>
          </div>
        </div>
      </div>
    );
  }

  const items = selectedReparto.items_entrega || [];
  const pendientes = items.filter(i => i.estado === 'PENDIENTE').length;
  const entregados = items.filter(i => i.estado === 'ENTREGADO').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-blue-600 dark:bg-blue-800 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">Mi Ruta</h1>
            <p className="text-blue-100 dark:text-blue-200 text-sm">
              {selectedReparto.chofer?.nombre} • {selectedReparto.flota?.patente}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-blue-700 dark:bg-blue-900 hover:bg-blue-800 dark:hover:bg-blue-950 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{items.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{pendientes}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Pendientes</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{entregados}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Entregados</p>
          </div>
        </div>
      </div>

      {/* Contenido según tab activo */}
      {activeTab === 'entregas' ? (
        <>
          {/* Delivery Cards Colapsables */}
          <div className="max-w-md mx-auto px-4 space-y-3">
            {items.map((item, index) => {
              const badge = getEstadoBadge(item.estado);
              const isExpanded = expandedItem === item.id;
              
              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  {/* Card Header - Siempre visible */}
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full bg-gray-50 dark:bg-gray-900/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">#{index + 1}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        ${item.Importe?.toLocaleString()}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      )}
                    </div>
                  </button>

                  {/* Info Básica - Siempre visible */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                      {item.cliente_nombre || 'Cliente'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Factura: {item.NroFactura}</p>
                  </div>

                  {/* Detalles - Expandible */}
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
                      {item.NroRemito && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">Remito: {item.NroRemito}</p>
                      )}

                      {/* Dirección con botón de mapa */}
                      <button
                        onClick={() => openGoogleMaps(item.DomicilioEntrega)}
                        className="w-full flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-left border border-blue-200 dark:border-blue-800"
                      >
                        <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                            {item.DomicilioEntrega || 'Sin dirección'}
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
                            <Navigation className="w-3 h-3" />
                            Abrir en Google Maps
                          </p>
                        </div>
                      </button>

                      {/* Botones de acción - Solo si está pendiente */}
                      {item.estado === 'PENDIENTE' && (
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'ENTREGADO')}
                            className="flex items-center justify-center gap-2 bg-green-600 dark:bg-green-700 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 dark:hover:bg-green-800 active:bg-green-800 dark:active:bg-green-900 transition-colors shadow-md"
                            style={{ touchAction: 'manipulation', minHeight: '56px' }}
                          >
                            <CheckCircle className="w-6 h-6" />
                            Entregado
                          </button>
                          <button
                            onClick={() => {
                              const motivo = prompt('Motivo del fallo (opcional):');
                              handleUpdateStatus(item.id, 'NO_ENTREGADO', motivo || '');
                            }}
                            className="flex items-center justify-center gap-2 bg-red-600 dark:bg-red-700 text-white py-4 rounded-lg font-semibold text-lg hover:bg-red-700 dark:hover:bg-red-800 active:bg-red-800 dark:active:bg-red-900 transition-colors shadow-md"
                            style={{ touchAction: 'manipulation', minHeight: '56px' }}
                          >
                            <XCircle className="w-6 h-6" />
                            No Entregado
                          </button>
                        </div>
                      )}

                      {/* Info de entrega completada */}
                      {item.estado !== 'PENDIENTE' && item.hora_visita && (
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Marcado el {item.hora_visita.toDate?.().toLocaleString('es-AR')}
                          </p>
                          {item.motivo_fallo && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                              Motivo: {item.motivo_fallo}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <GastosView 
          gastos={selectedReparto.gastos_ruta || []} 
          onAddGasto={() => setShowGastoModal(true)} 
        />
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-safe z-20">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={() => setActiveTab('entregas')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              activeTab === 'entregas' 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Truck className="w-6 h-6" />
            <span className="text-xs font-medium">Entregas</span>
          </button>
          <button
            onClick={() => setActiveTab('gastos')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              activeTab === 'gastos' 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Receipt className="w-6 h-6" />
            <span className="text-xs font-medium">Gastos</span>
          </button>
        </div>
      </div>

      {/* Floating Action Button - Solo visible en tab de gastos */}
      {activeTab === 'gastos' && (
        <button
          onClick={() => setShowGastoModal(true)}
          className="fixed bottom-20 right-4 bg-blue-600 dark:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors z-10"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Modal Agregar Gasto */}
      {showGastoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Registrar Gasto</h2>
                <button 
                  onClick={() => {
                    setShowGastoModal(false);
                    setPhotoPreview(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddGasto} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Concepto</label>
                  <select
                    value={gastoForm.concepto}
                    onChange={(e) => setGastoForm({ ...gastoForm, concepto: e.target.value })}
                    className="input-field"
                  >
                    <option value="Combustible">Combustible</option>
                    <option value="Peaje">Peaje</option>
                    <option value="Viático">Viático</option>
                    <option value="Mecánica">Mecánica</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monto ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={gastoForm.monto}
                    onChange={(e) => setGastoForm({ ...gastoForm, monto: e.target.value })}
                    className="input-field"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kilometraje (Opcional)</label>
                  <input
                    type="number"
                    min="0"
                    value={gastoForm.km_registrado}
                    onChange={(e) => setGastoForm({ ...gastoForm, km_registrado: e.target.value })}
                    className="input-field"
                    placeholder="KM actual"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comprobante (Foto)</label>
                  
                  {!photoPreview ? (
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer relative bg-gray-50 dark:bg-gray-900/50">
                      <div className="space-y-1 text-center">
                        <Camera className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none">
                            <span>Subir una foto</span>
                            <input id="file-upload" name="file-upload" type="file" accept="image/*" capture="environment" className="sr-only" onChange={handlePhotoCapture} />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG hasta 5MB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative mt-2">
                      <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow-md hover:bg-red-700 transition-colors"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowGastoModal(false);
                      setPhotoPreview(null);
                    }}
                    className="flex-1 btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    <DollarSign className="w-5 h-5" />
                    Guardar Gasto
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChoferHome;
