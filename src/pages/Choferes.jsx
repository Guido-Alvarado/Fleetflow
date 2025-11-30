import { useState, useEffect } from 'react';
import { getChoferes, createChofer, updateChofer, deleteChofer } from '../services/firestore';
import { Plus, Edit2, Trash2, X, Power } from 'lucide-react';
import { TableSkeleton } from '../components/Skeleton';

const Choferes = () => {
  const [choferes, setChoferes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingChofer, setEditingChofer] = useState(null);
  const [formData, setFormData] = useState({
    Nombre: '',
    Dni: '',
    Cuil: '',
    Domicilio: '',
    email: '',
    Celular: '',
    FechaNac: '',
    password: '',
    rol: 'chofer'
  });

  useEffect(() => {
    loadChoferes();
  }, []);

  const loadChoferes = async () => {
    try {
      const data = await getChoferes();
      setChoferes(data);
    } catch (error) {
      console.error('Error loading choferes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingChofer) {
        const { password, rol, ...choferData } = formData;
        await updateChofer(editingChofer.id, choferData);
        alert('Chofer actualizado exitosamente');
      } else {
        if (!formData.email || !formData.password) {
          alert('Email y contraseña son obligatorios para crear un nuevo chofer');
          return;
        }

        if (formData.password.length < 6) {
          alert('La contraseña debe tener al menos 6 caracteres');
          return;
        }

        const { createUserWithEmailAndPassword } = await import('firebase/auth');
        const { auth } = await import('../firebase/config');
        
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth, 
            formData.email, 
            formData.password
          );
          
          const { password, rol, ...choferData } = formData;
          await createChofer({
            ...choferData,
            userId: userCredential.user.uid,
            rol: 'chofer',
            activo: true
          });

          alert(`✅ Chofer creado exitosamente!\n\n📧 Email: ${formData.email}\n🔑 Contraseña: ${formData.password}\n\n⚠️ Guarda estas credenciales y compártelas con el chofer.`);
        } catch (authError) {
          if (authError.code === 'auth/email-already-in-use') {
            alert('Este email ya está registrado. Usa otro email.');
          } else {
            throw authError;
          }
          return;
        }
      }
      
      loadChoferes();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving chofer:', error);
      alert('Error al guardar el chofer: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este chofer?')) {
      try {
        await deleteChofer(id);
        loadChoferes();
      } catch (error) {
        console.error('Error deleting chofer:', error);
        alert('Error al eliminar el chofer');
      }
    }
  };

  const toggleActive = async (chofer) => {
    const newStatus = !chofer.activo;
    const action = newStatus ? 'activar' : 'desactivar';
    
    if (window.confirm(`¿Está seguro de ${action} a ${chofer.Nombre}?`)) {
      try {
        await updateChofer(chofer.id, { activo: newStatus });
        loadChoferes();
        alert(`Chofer ${newStatus ? 'activado' : 'desactivado'} exitosamente`);
      } catch (error) {
        console.error('Error toggling chofer status:', error);
        alert('Error al cambiar el estado del chofer');
      }
    }
  };

  const handleEdit = (chofer) => {
    setEditingChofer(chofer);
    setFormData({
      Nombre: chofer.Nombre || '',
      Dni: chofer.Dni || '',
      Cuil: chofer.Cuil || '',
      Domicilio: chofer.Domicilio || '',
      email: chofer.email || '',
      Celular: chofer.Celular || '',
      FechaNac: chofer.FechaNac?.toDate?.()?.toISOString().split('T')[0] || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingChofer(null);
    setFormData({
      Nombre: '',
      Dni: '',
      Cuil: '',
      Domicilio: '',
      email: '',
      Celular: '',
      FechaNac: '',
      password: '',
      rol: 'chofer'
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
        <TableSkeleton rows={8} columns={7} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Choferes</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Chofer
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">DNI</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">CUIL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Celular</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {choferes.map((chofer) => (
                <tr key={chofer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{chofer.Nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{chofer.Dni}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{chofer.Cuil}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{chofer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{chofer.Celular}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      chofer.activo 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400'
                    }`}>
                      {chofer.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => toggleActive(chofer)}
                      className={`mr-3 ${
                        chofer.activo
                          ? 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                          : 'text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300'
                      }`}
                      title={chofer.activo ? 'Desactivar' : 'Activar'}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(chofer)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(chofer.id)}
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
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingChofer ? 'Editar Chofer' : 'Nuevo Chofer'}</h2>
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">DNI</label>
                    <input
                      type="number"
                      required
                      value={formData.Dni}
                      onChange={(e) => setFormData({ ...formData, Dni: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CUIL</label>
                    <input
                      type="text"
                      value={formData.Cuil}
                      onChange={(e) => setFormData({ ...formData, Cuil: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      value={formData.FechaNac}
                      onChange={(e) => setFormData({ ...formData, FechaNac: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  {!editingChofer && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contraseña (para login) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input-field"
                        placeholder="Mínimo 6 caracteres"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Esta contraseña se usará para que el chofer inicie sesión
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Celular</label>
                    <input
                      type="text"
                      value={formData.Celular}
                      onChange={(e) => setFormData({ ...formData, Celular: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Domicilio</label>
                    <input
                      type="text"
                      value={formData.Domicilio}
                      onChange={(e) => setFormData({ ...formData, Domicilio: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={handleCloseModal} className="btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingChofer ? 'Actualizar' : 'Crear'}
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

export default Choferes;
