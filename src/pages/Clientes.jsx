import { useState, useEffect } from 'react';
import { getClientes, getZonas, createCliente, updateCliente, deleteCliente } from '../services/firestore';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { TableSkeleton } from '../components/Skeleton';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [formData, setFormData] = useState({
    Nombre: '',
    RazonSocial: '',
    Cuit: '',
    Contacto: '',
    email: '',
    DomicilioFiscal: '',
    DomicilioEntrega: '',
    IdZona: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [clientesData, zonasData] = await Promise.all([
        getClientes(),
        getZonas()
      ]);
      setClientes(clientesData);
      setZonas(zonasData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCliente) {
        await updateCliente(editingCliente.id, formData);
      } else {
        await createCliente(formData);
      }
      loadData();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving cliente:', error);
      alert('Error al guardar el cliente');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este cliente?')) {
      try {
        await deleteCliente(id);
        loadData();
      } catch (error) {
        console.error('Error deleting cliente:', error);
        alert('Error al eliminar el cliente');
      }
    }
  };

  const handleEdit = (cliente) => {
    setEditingCliente(cliente);
    setFormData({
      Nombre: cliente.Nombre || '',
      RazonSocial: cliente.RazonSocial || '',
      Cuit: cliente.Cuit || '',
      Contacto: cliente.Contacto || '',
      email: cliente.email || '',
      DomicilioFiscal: cliente.DomicilioFiscal || '',
      DomicilioEntrega: cliente.DomicilioEntrega || '',
      IdZona: cliente.IdZona || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCliente(null);
    setFormData({
      Nombre: '',
      RazonSocial: '',
      Cuit: '',
      Contacto: '',
      email: '',
      DomicilioFiscal: '',
      DomicilioEntrega: '',
      IdZona: ''
    });
  };

  const getZonaNombre = (idZona) => {
    const zona = zonas.find(z => z.id === idZona);
    return zona ? zona.Zona : '-';
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Clientes</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Cliente
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Razón Social</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">CUIT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Zona</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{cliente.Nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{cliente.RazonSocial}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{cliente.Cuit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{cliente.Contacto}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{getZonaNombre(cliente.IdZona)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(cliente)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cliente.id)}
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
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
                <button onClick={handleCloseModal} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                    <input
                      type="text"
                      required
                      value={formData.Nombre}
                      onChange={(e) => setFormData({ ...formData, Nombre: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Razón Social</label>
                    <input
                      type="text"
                      value={formData.RazonSocial}
                      onChange={(e) => setFormData({ ...formData, RazonSocial: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CUIT</label>
                    <input
                      type="text"
                      value={formData.Cuit}
                      onChange={(e) => setFormData({ ...formData, Cuit: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contacto</label>
                    <input
                      type="text"
                      value={formData.Contacto}
                      onChange={(e) => setFormData({ ...formData, Contacto: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Zona</label>
                    <select
                      required
                      value={formData.IdZona}
                      onChange={(e) => setFormData({ ...formData, IdZona: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Seleccionar zona</option>
                      {zonas.map(zona => (
                        <option key={zona.id} value={zona.id}>{zona.Zona}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Domicilio Fiscal</label>
                    <input
                      type="text"
                      value={formData.DomicilioFiscal}
                      onChange={(e) => setFormData({ ...formData, DomicilioFiscal: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Domicilio de Entrega</label>
                    <input
                      type="text"
                      value={formData.DomicilioEntrega}
                      onChange={(e) => setFormData({ ...formData, DomicilioEntrega: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={handleCloseModal} className="btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingCliente ? 'Actualizar' : 'Crear'}
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

export default Clientes;
