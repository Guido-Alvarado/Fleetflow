# Script para aplicar dark mode a todos los componentes

Este documento lista los cambios necesarios para aplicar dark mode a todos los componentes.

## Reglas de Reemplazo:

### Fondos
- `bg-white` → `bg-white dark:bg-gray-800`
- `bg-gray-50` → `bg-gray-50 dark:bg-gray-900/50`
- `bg-gray-100` → `bg-gray-100 dark:bg-gray-800`

### Texto
- `text-gray-900` → `text-gray-900 dark:text-white`
- `text-gray-700` → `text-gray-700 dark:text-gray-300`
- `text-gray-500` → `text-gray-500 dark:text-gray-400`

### Bordes
- `border-gray-100` → `border-gray-100 dark:border-gray-700`
- `border-gray-200` → `border-gray-200 dark:border-gray-700`
- `divide-gray-200` → `divide-gray-200 dark:divide-gray-700`

### Hover
- `hover:bg-gray-50` → `hover:bg-gray-50 dark:hover:bg-gray-700`
- `hover:text-gray-600` → `hover:text-gray-600 dark:hover:text-gray-300`

### Labels
- `text-gray-700 mb-1` (labels) → `text-gray-700 dark:text-gray-300 mb-1`

## Componentes a actualizar:
- ✅ Dashboard.jsx
- ✅ Repartos.jsx
- ⏳ Choferes.jsx
- ⏳ Clientes.jsx
- ⏳ Flota.jsx
- ⏳ Zonas.jsx
- ⏳ RepartoBuilder.jsx
