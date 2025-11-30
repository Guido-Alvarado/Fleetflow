# 📱 Barra de Navegación Inferior para Choferes

## Implementación

### Cambios Necesarios en ChoferHome.jsx:

1. **Agregar estado para navegación:**
```jsx
const [activeTab, setActiveTab] = useState('entregas'); // 'entregas' o 'gastos'
```

2. **Modificar el padding bottom del contenedor principal:**
```jsx
// Cambiar pb-20 a pb-24 para dar espacio a la barra de navegación
<div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
```

3. **Renderizar contenido condicional:**
```jsx
{/* Contenido según tab activo */}
{activeTab === 'entregas' ? (
  <div className="max-w-md mx-auto px-4 space-y-3">
    {/* Cards de entregas actuales */}
  </div>
) : (
  <div className="max-w-md mx-auto px-4">
    <GastosView selectedReparto={selectedReparto} />
  </div>
)}
```

4. **Agregar barra de navegación inferior:**
```jsx
{/* Bottom Navigation */}
<div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-30 safe-area-inset-bottom">
  <div className="max-w-md mx-auto grid grid-cols-2">
    <button
      onClick={() => setActiveTab('entregas')}
      className={`flex flex-col items-center justify-center py-3 px-4 transition-colors ${
        activeTab === 'entregas'
          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
    >
      <Truck className="w-6 h-6 mb-1" />
      <span className="text-xs font-medium">Entregas</span>
    </button>
    
    <button
      onClick={() => setActiveTab('gastos')}
      className={`flex flex-col items-center justify-center py-3 px-4 transition-colors ${
        activeTab === 'gastos'
          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
    >
      <Receipt className="w-6 h-6 mb-1" />
      <span className="text-xs font-medium">Gastos</span>
    </button>
  </div>
</div>
```

5. **Modificar el FAB (Floating Action Button):**
```jsx
{/* Solo mostrar FAB en tab de gastos */}
{activeTab === 'gastos' && (
  <button
    onClick={() => setShowGastoModal(true)}
    className="fixed bottom-20 right-6 w-16 h-16 bg-blue-600 dark:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 dark:hover:bg-blue-800 active:bg-blue-800 dark:active:bg-blue-900 transition-colors z-20"
    style={{ touchAction: 'manipulation' }}
  >
    <Plus className="w-8 h-8" />
  </button>
)}
```

## Estructura Final:

```
┌─────────────────────────────┐
│  Header (sticky top)        │
│  - Título                   │
│  - Botones (theme, logout)  │
├─────────────────────────────┤
│                             │
│  Stats Cards (solo entregas)│
│                             │
├─────────────────────────────┤
│                             │
│  Contenido Dinámico:        │
│  - Tab Entregas: Cards      │
│  - Tab Gastos: GastosView   │
│                             │
│                             │
│                             │
├─────────────────────────────┤
│  Bottom Navigation (fixed)  │
│  [Entregas] [Gastos]        │
└─────────────────────────────┘
```

## Iconos:
- **Entregas**: `Truck` (camión)
- **Gastos**: `Receipt` (recibo/ticket)

## Estados Visuales:
- **Activo**: Azul con fondo azul claro
- **Inactivo**: Gris con hover

## Responsive:
- Máximo ancho: 448px (max-w-md)
- Safe area para iOS
- Touch-friendly (py-3 px-4)
