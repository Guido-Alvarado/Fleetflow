import { useState } from 'react';
import { DollarSign, Calendar, MapPin, Camera, ChevronDown, ChevronUp } from 'lucide-react';

const GastosView = ({ selectedReparto }) => {
  const [expandedGasto, setExpandedGasto] = useState(null);

  if (!selectedReparto) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No hay reparto seleccionado
      </div>
    );
  }

  const gastos = selectedReparto.gastos_ruta || [];
  const totalGastado = gastos.reduce((sum, gasto) => sum + (gasto.monto || 0), 0);

  const toggleGasto = (index) => {
    setExpandedGasto(expandedGasto === index ? null : index);
  };

  if (gastos.length === 0) {
    return (
      <div className="text-center py-12">
        <DollarSign className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No hay gastos registrados
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Los gastos que agregues aparecerán aquí
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Resumen Total */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-xl p-6 text-white shadow-lg">
        <p className="text-sm opacity-90 mb-1">Total Gastado</p>
        <p className="text-4xl font-bold">${totalGastado.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</p>
        <p className="text-sm opacity-75 mt-2">{gastos.length} gasto{gastos.length !== 1 ? 's' : ''} registrado{gastos.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Lista de Gastos Colapsables */}
      <div className="space-y-3">
        {gastos.map((gasto, index) => {
          const isExpanded = expandedGasto === index;
          
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
            >
              {/* Header - Siempre visible */}
              <button
                onClick={() => toggleGasto(index)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {gasto.concepto}
                      </h3>
                      {gasto.foto_url && (
                        <Camera className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    {gasto.fecha_registro && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {gasto.fecha_registro.toDate?.().toLocaleDateString('es-AR')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-bold text-red-600 dark:text-red-400">
                    ${gasto.monto.toLocaleString('es-AR')}
                  </p>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  )}
                </div>
              </button>

              {/* Detalles - Expandible */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
                  {gasto.km_registrado && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>Kilometraje: {gasto.km_registrado.toLocaleString()} km</span>
                    </div>
                  )}

                  {gasto.fecha_registro && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {gasto.fecha_registro.toDate?.().toLocaleString('es-AR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}

                  {/* Preview de foto si existe */}
                  {gasto.foto_url && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Comprobante:
                      </p>
                      <img
                        src={gasto.foto_url}
                        alt="Comprobante"
                        className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(gasto.foto_url, '_blank')}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                        Click para ver en tamaño completo
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Balance */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">A Cobrar</p>
            <p className="text-lg font-bold text-blue-900 dark:text-blue-300">
              ${selectedReparto.balance?.total_a_cobrar?.toLocaleString('es-AR') || 0}
            </p>
          </div>
          <div>
            <p className="text-xs text-red-600 dark:text-red-400 mb-1">Gastado</p>
            <p className="text-lg font-bold text-red-900 dark:text-red-300">
              ${totalGastado.toLocaleString('es-AR')}
            </p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
          <p className="text-xs text-blue-600 dark:text-blue-400 text-center mb-1">A Rendir</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-300 text-center">
            ${((selectedReparto.balance?.total_a_cobrar || 0) - totalGastado).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GastosView;
