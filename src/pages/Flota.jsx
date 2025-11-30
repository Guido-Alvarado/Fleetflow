import { useState, useEffect } from 'react';
import { getFlota, createVehiculo, updateVehiculo, deleteVehiculo } from '../services/firestore';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { TableSkeleton } from '../components/Skeleton';

const Flota = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVehiculo, setEditingVehiculo] = useState(null);
  const [formData, setFormData] = useState({
    Marca: '',
    Dominio: '',
    Km: 0,
    Hs: 0,
    Nomesc: ''
  });

  useEffect(() => {
    loadFlota();
  }, []);

  const loadFlota = async () => {
    try {
      const data = await getFlota();
      setVehiculos(data);
    } catch (error) {
      console.error('Error loading flota:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSave = {
        ...formData,
        Km: Number(formData.Km),
        Hs: Number(formData.Hs)
      };

      if (editingVehiculo) {
        await updateVehiculo(editingVehiculo.id, dataToSave);
      } else {
        await createVehiculo(dataToSave);
      }
      loadFlota();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving vehiculo:', error);
      alert('Error al guardar el vehículo');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este vehículo?')) {
      try {
        await deleteVehiculo(id);
        loadFlota();
      } catch (error) {
        console.error('Error deleting vehiculo:', error);
        alert('Error al eliminar el vehículo');
      }
    }
  };

  const handleEdit = (vehiculo) => {
    setEditingVehiculo(vehiculo);
    setFormData({
      Marca: vehiculo.Marca || '',
      Dominio: vehiculo.Dominio || '',
      Km: vehiculo.Km || 0,
      Hs: vehiculo.Hs || 0,
      Nomesc: vehiculo.Nomesc || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVehiculo(null);
    setFormData({
      Marca: '',
      Dominio: '',
      Km: 0,
      Hs: 0,
      Nomesc: ''
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <TableSkeleton rows={8} columns={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Flota de Vehículos</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Vehículo
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Marca</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dominio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kilometraje</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Horas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {vehiculos.map((vehiculo) => (
                <tr key={vehiculo.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{vehiculo.Marca}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{vehiculo.Dominio}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{vehiculo.Km?.toLocaleString()} km</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{vehiculo.Hs} hs</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{vehiculo.Nomesc}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(vehiculo)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(vehiculo.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingVehiculo ? 'Editar Vehículo' : 'Nuevo Vehículo'}</h2>
                <button onClick={handleCloseModal} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Marca</label>
                    <input
                      type="text"
                      required
                      value={formData.Marca}
                      onChange={(e) => setFormData({ ...formData, Marca: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dominio</label>
                    <input
                      type="text"
                      required
                      value={formData.Dominio}
                      onChange={(e) => setFormData({ ...formData, Dominio: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kilometraje</label>
                    <input
                      type="number"
                      required
                      value={formData.Km}
                      onChange={(e) => setFormData({ ...formData, Km: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Horas</label>
                    <input
                      type="number"
                      required
                      value={formData.Hs}
                      onChange={(e) => setFormData({ ...formData, Hs: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                    <input
                      type="text"
                      value={formData.Nomesc}
                      onChange={(e) => setFormData({ ...formData, Nomesc: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={handleCloseModal} className="btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingVehiculo ? 'Actualizar' : 'Crear'}
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

export default Flota;
