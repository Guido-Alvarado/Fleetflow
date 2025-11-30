# 🌙 Modo Oscuro - FleetFlow

## ✅ Implementación Completa

Se ha implementado un sistema completo de modo oscuro (Dark Mode) para toda la aplicación FleetFlow.

---

## 🎨 Características

### **1. Toggle de Tema**
- **Login:** Botón en esquina superior derecha
- **Admin (Desktop):** Botón en sidebar, encima de "Cerrar Sesión"
- **Admin (Mobile):** Botón en header móvil
- **Chofer:** Botón en header principal

### **2. Persistencia**
- La preferencia se guarda en `localStorage`
- Se mantiene entre sesiones
- Detecta preferencia del sistema operativo por defecto

### **3. Transiciones Suaves**
- Cambios de color animados
- Experiencia fluida al cambiar de modo

---

## 🎯 Componentes Actualizados

### **Core**
- ✅ `ThemeContext.jsx` - Contexto global de tema
- ✅ `tailwind.config.js` - Configuración dark mode
- ✅ `index.css` - Clases globales con dark mode
- ✅ `App.jsx` - ThemeProvider wrapper

### **Layouts**
- ✅ `AdminLayout.jsx` - Sidebar, header, main content

### **Pages**
- ✅ `Login.jsx` - Pantalla de inicio de sesión
- ✅ `ChoferHome.jsx` - Vista del chofer
- ✅ `Dashboard.jsx` - Usa clases globales (auto dark mode)
- ✅ `Repartos.jsx` - Usa clases globales (auto dark mode)
- ✅ `RepartoBuilder.jsx` - Usa clases globales (auto dark mode)
- ✅ `Choferes.jsx` - Usa clases globales (auto dark mode)
- ✅ `Flota.jsx` - Usa clases globales (auto dark mode)
- ✅ `Clientes.jsx` - Usa clases globales (auto dark mode)
- ✅ `Zonas.jsx` - Usa clases globales (auto dark mode)

---

## 🎨 Paleta de Colores

### **Modo Claro (Light)**
```
Fondo Principal: bg-gray-50
Fondo Tarjetas: bg-white
Texto Principal: text-gray-900
Texto Secundario: text-gray-600
Bordes: border-gray-200
Primario: bg-blue-600
```

### **Modo Oscuro (Dark)**
```
Fondo Principal: dark:bg-gray-900
Fondo Tarjetas: dark:bg-gray-800
Texto Principal: dark:text-white
Texto Secundario: dark:text-gray-400
Bordes: dark:border-gray-700
Primario: dark:bg-blue-500
```

---

## 📝 Clases Globales

Todas estas clases tienen soporte automático para dark mode:

### **Botones**
```css
.btn-primary
/* Light: bg-blue-600 */
/* Dark: dark:bg-blue-500 */

.btn-secondary
/* Light: bg-gray-200 text-gray-800 */
/* Dark: dark:bg-gray-700 dark:text-gray-200 */
```

### **Inputs**
```css
.input-field
/* Light: bg-white border-gray-300 */
/* Dark: dark:bg-gray-800 dark:border-gray-600 */
```

### **Cards**
```css
.card
/* Light: bg-white border-gray-100 */
/* Dark: dark:bg-gray-800 dark:border-gray-700 */
```

---

## 🔧 Cómo Usar

### **En Componentes Nuevos**

#### **Opción 1: Usar Clases Globales** (Recomendado)
```jsx
<div className="card">
  <button className="btn-primary">Guardar</button>
  <input className="input-field" />
</div>
```

#### **Opción 2: Clases Tailwind Directas**
```jsx
<div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
  <h2 className="text-gray-900 dark:text-white">Título</h2>
  <p className="text-gray-600 dark:text-gray-400">Descripción</p>
</div>
```

#### **Opción 3: Usar el Hook**
```jsx
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {isDarkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
    </button>
  );
}
```

---

## 🎨 Patrones de Color Comunes

### **Fondos**
```jsx
// Fondo principal
className="bg-gray-50 dark:bg-gray-900"

// Tarjetas/Contenedores
className="bg-white dark:bg-gray-800"

// Fondos secundarios
className="bg-gray-100 dark:bg-gray-700"
```

### **Texto**
```jsx
// Título principal
className="text-gray-900 dark:text-white"

// Texto normal
className="text-gray-700 dark:text-gray-300"

// Texto secundario
className="text-gray-600 dark:text-gray-400"

// Texto deshabilitado
className="text-gray-400 dark:text-gray-600"
```

### **Bordes**
```jsx
// Borde normal
className="border-gray-200 dark:border-gray-700"

// Borde sutil
className="border-gray-100 dark:border-gray-800"
```

### **Estados Hover**
```jsx
// Hover en botones
className="hover:bg-gray-100 dark:hover:bg-gray-700"

// Hover en texto
className="hover:text-gray-900 dark:hover:text-white"
```

---

## 🚀 Ejemplos Completos

### **Modal**
```jsx
<div className="fixed inset-0 bg-black bg-opacity-50 z-50">
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto mt-20">
    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
      Título del Modal
    </h2>
    <p className="text-gray-600 dark:text-gray-400 mb-4">
      Contenido del modal
    </p>
    <div className="flex gap-3">
      <button className="btn-secondary">Cancelar</button>
      <button className="btn-primary">Confirmar</button>
    </div>
  </div>
</div>
```

### **Tabla**
```jsx
<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
  <thead className="bg-gray-50 dark:bg-gray-900">
    <tr>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
        Nombre
      </th>
    </tr>
  </thead>
  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
        Dato
      </td>
    </tr>
  </tbody>
</table>
```

### **Badge/Pill**
```jsx
<span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
  Activo
</span>
```

---

## 🎯 Badges de Estado

### **Pendiente**
```jsx
className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
```

### **En Curso**
```jsx
className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
```

### **Completado**
```jsx
className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
```

### **Error/Cancelado**
```jsx
className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
```

---

## 🔍 Testing

### **Verificar que funciona:**

1. **Abrir la aplicación**
2. **Click en el ícono de luna/sol** (en cualquier página)
3. **Verificar que:**
   - ✅ Los colores cambian suavemente
   - ✅ Todo el texto es legible
   - ✅ Los botones mantienen buen contraste
   - ✅ Los modales se ven bien
   - ✅ Las tablas son legibles
   - ✅ Los formularios funcionan correctamente

### **Probar en:**
- ✅ Login
- ✅ Dashboard
- ✅ Todas las páginas de admin
- ✅ Vista del chofer
- ✅ Modales y formularios

---

## 💡 Tips

### **1. Contraste**
Siempre asegúrate de que el texto tenga suficiente contraste:
- Texto oscuro sobre fondo claro (modo claro)
- Texto claro sobre fondo oscuro (modo oscuro)

### **2. Consistencia**
Usa las clases globales cuando sea posible para mantener consistencia.

### **3. Iconos**
Los iconos de Lucide React se adaptan automáticamente al color del texto:
```jsx
<Sun className="w-5 h-5 text-yellow-500" />
<Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
```

### **4. Sombras**
Las sombras se ven mejor en modo claro. En modo oscuro, usa bordes:
```jsx
className="shadow-lg dark:shadow-2xl border dark:border-gray-700"
```

---

## 🐛 Troubleshooting

### **El modo oscuro no se aplica**
- Verifica que `<ThemeProvider>` esté en `App.jsx`
- Verifica que `darkMode: 'class'` esté en `tailwind.config.js`

### **Los colores no cambian**
- Asegúrate de usar el prefijo `dark:` en las clases
- Verifica que las clases estén en el `content` de Tailwind

### **La preferencia no se guarda**
- Verifica que `localStorage` esté disponible
- Revisa la consola del navegador por errores

---

## 📚 Recursos

- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Lucide React Icons](https://lucide.dev/)
- [Context API React](https://react.dev/reference/react/useContext)

---

**Última actualización:** 29/11/2024
**Versión:** 1.0.0
