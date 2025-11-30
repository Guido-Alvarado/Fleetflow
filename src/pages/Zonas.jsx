import { useState, useEffect } from 'react';
import { getZonas, createZona, updateZona, deleteZona } from '../services/firestore';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { TableSkeleton } from '../components/Skeleton';

const Zonas = () => {
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingZona, setEditingZona] = useState(null);
  const [formData, setFormData] = useState({
    Zona: ''
  });

  useEffect(() => {
    loadZonas();
  }, []);

  const loadZonas = async () => {
    try {
      const data = await getZonas();
      setZonas(data);
    } catch (error) {
      console.error('Error loading zonas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingZona) {
        await updateZona(editingZona.id, formData);
      } else {
        await createZona(formData);
      }
      loadZonas();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving zona:', error);
      alert('Error al guardar la zona');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta zona?')) {
      try {
        await deleteZona(id);
        loadZonas();
      } catch (error) {
        console.error('Error deleting zona:', error);
        alert('Error al eliminar la zona');
      }
    }
  };

  const handleEdit = (zona) => {
    setEditingZona(zona);
    setFormData({
      Zona: zona.Zona || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingZona(null);
    setFormData({
      Zona: ''
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
        <TableSkeleton rows={5} columns={2} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Zonas</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Zona
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Zona</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {zonas.map((zona) => (
                <tr key={zona.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{zona.Zona}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(zona)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(zona.id)}
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
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingZona ? 'Editar Zona' : 'Nueva Zona'}</h2>
                <button onClick={handleCloseModal} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre de la Zona</label>
                  <input
                    type="text"
                    required
                    value={formData.Zona}
                    onChange={(e) => setFormData({ ...formData, Zona: e.target.value })}
                    className="input-field"
                    placeholder="Ej: Zona Norte"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={handleCloseModal} className="btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingZona ? 'Actualizar' : 'Crear'}
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

export default Zonas;
