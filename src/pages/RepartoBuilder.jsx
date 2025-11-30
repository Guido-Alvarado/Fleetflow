import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChoferes, getFlota, getClientes, createReparto } from '../services/firestore';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const RepartoBuilder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Datos maestros
  const [choferes, setChoferes] = useState([]);
  const [flota, setFlota] = useState([]);
  const [clientes, setClientes] = useState([]);
  
  // Formulario principal
  const [formData, setFormData] = useState({
    IdChofer: '',
    IdFlota: '',
    Fecha: new Date().toISOString().split('T')[0],
    Obsercacion: ''
  });
  
  // Items de entrega (array)
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadMasterData();
  }, []);

  const loadMasterData = async () => {
    try {
      const [choferesData, flotaData, clientesData] = await Promise.all([
        getChoferes(),
        getFlota(),
        getClientes()
      ]);
      setChoferes(choferesData);
      setFlota(flotaData);
      setClientes(clientesData);
    } catch (error) {
      console.error('Error loading master data:', error);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setItems([...items, {
      id: uuidv4(),
      IdCliente: '',
      NroFactura: '',
      NroRemito: '',
      Importe: 0,
      DomicilioEntrega: '',
      IdZona: ''
    }]);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        // Si se selecciona un cliente, autocompletar dirección y zona
        if (field === 'IdCliente') {
          const cliente = clientes.find(c => c.id === value);
          if (cliente) {
            return {
              ...item,
              IdCliente: value,
              DomicilioEntrega: cliente.DomicilioEntrega || '',
              IdZona: cliente.IdZona || '',
              cliente_nombre: cliente.Nombre || ''
            };
          }
        }
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const calculateTotals = () => {
    const total = items.reduce((sum, item) => sum + (parseFloat(item.Importe) || 0), 0);
    const cantidad = items.length;
    return { total, cantidad };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.IdChofer || !formData.IdFlota) {
      alert('Debe seleccionar un chofer y un vehículo');
      return;
    }
    
    if (items.length === 0) {
      alert('Debe agregar al menos una entrega');
      return;
    }

    setSaving(true);
    try {
      const { total, cantidad } = calculateTotals();
      
      // Obtener datos del chofer y flota para denormalizar
      const chofer = choferes.find(c => c.id === formData.IdChofer);
      const vehiculo = flota.find(f => f.id === formData.IdFlota);

      const repartoData = {
        ...formData,
        TotalReparto: total,
        CantidadReparto: cantidad,
        estado_global: 'PENDIENTE',
        chofer: {
          id: chofer.id,
          nombre: chofer.Nombre
        },
        flota: {
          id: vehiculo.id,
          patente: vehiculo.Dominio,
          kilometraje_inicial: vehiculo.Km
        },
        items_entrega: items.map(item => ({
          ...item,
          estado: 'PENDIENTE',
          motivo_fallo: '',
          hora_visita: null,
          geolocalizacion: { lat: 0, lng: 0 }
        })),
        gastos_ruta: [],
        balance: {
          total_a_cobrar: total,
          total_gastado: 0,
          total_rendido: total
        }
      };

      await createReparto(repartoData);
      alert('Reparto creado exitosamente');
      navigate('/admin/repartos');
    } catch (error) {
      console.error('Error creating reparto:', error);
      alert('Error al crear el reparto');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-gray-600 dark:text-gray-400">Cargando...</div>;
  }

  const { total, cantidad } = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nuevo Reparto</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Crea una nueva ruta de entrega</p>
        </div>
        <button
          onClick={() => navigate('/admin/repartos')}
          className="btn-secondary flex items-center gap-2"
        >
          <X className="w-5 h-5" />
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos Principales */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Información del Reparto</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Chofer *</label>
              <select
                required
                value={formData.IdChofer}
                onChange={(e) => setFormData({ ...formData, IdChofer: e.target.value })}
                className="input-field"
              >
                <option value="">Seleccionar chofer</option>
                {choferes.filter(c => c.activo !== false).map(chofer => (
                  <option key={chofer.id} value={chofer.id}>{chofer.Nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehículo *</label>
              <select
                required
                value={formData.IdFlota}
                onChange={(e) => setFormData({ ...formData, IdFlota: e.target.value })}
                className="input-field"
              >
                <option value="">Seleccionar vehículo</option>
                {flota.map(vehiculo => (
                  <option key={vehiculo.id} value={vehiculo.id}>
                    {vehiculo.Marca} - {vehiculo.Dominio}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha *</label>
              <input
                type="date"
                required
                value={formData.Fecha}
                onChange={(e) => setFormData({ ...formData, Fecha: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observaciones</label>
              <textarea
                value={formData.Obsercacion}
                onChange={(e) => setFormData({ ...formData, Obsercacion: e.target.value })}
                className="input-field"
                rows="2"
                placeholder="Notas adicionales sobre el reparto..."
              />
            </div>
          </div>
        </div>

        {/* Items de Entrega */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Entregas ({cantidad})</h2>
            <button
              type="button"
              onClick={addItem}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar Entrega
            </button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No hay entregas agregadas. Haz clic en "Agregar Entrega" para comenzar.
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-gray-900 dark:text-white">Entrega #{index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cliente *</label>
                      <select
                        required
                        value={item.IdCliente}
                        onChange={(e) => updateItem(item.id, 'IdCliente', e.target.value)}
                        className="input-field"
                      >
                        <option value="">Seleccionar cliente</option>
                        {clientes.map(cliente => (
                          <option key={cliente.id} value={cliente.id}>{cliente.Nombre}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nro. Factura *</label>
                      <input
                        type="text"
                        required
                        value={item.NroFactura}
                        onChange={(e) => updateItem(item.id, 'NroFactura', e.target.value)}
                        className="input-field"
                        placeholder="A-0001-00000001"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nro. Remito</label>
                      <input
                        type="text"
                        value={item.NroRemito}
                        onChange={(e) => updateItem(item.id, 'NroRemito', e.target.value)}
                        className="input-field"
                        placeholder="R-0001"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Importe *</label>
                      <input
                        type="number"
                        required
                        step="0.01"
                        value={item.Importe}
                        onChange={(e) => updateItem(item.id, 'Importe', e.target.value)}
                        className="input-field"
                        placeholder="0.00"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dirección de Entrega</label>
                      <input
                        type="text"
                        value={item.DomicilioEntrega}
                        onChange={(e) => updateItem(item.id, 'DomicilioEntrega', e.target.value)}
                        className="input-field"
                        placeholder="Se autocompleta al seleccionar cliente"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resumen */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total de Entregas</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-300">{cantidad}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total a Cobrar</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-300">${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/repartos')}
            className="btn-secondary"
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
            disabled={saving}
          >
            <Save className="w-5 h-5" />
            {saving ? 'Guardando...' : 'Crear Reparto'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RepartoBuilder;
