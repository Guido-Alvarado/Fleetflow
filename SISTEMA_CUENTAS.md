# 🔐 Sistema de Cuentas de Usuario - FleetFlow

## 📋 Resumen

FleetFlow ahora crea automáticamente cuentas de usuario cuando se da de alta un chofer.

---

## 👥 Tipos de Usuarios

### 1. **Administrador**
- Acceso completo al sistema
- Gestiona choferes, flota, clientes, zonas
- Crea y asigna repartos
- Ve dashboard y reportes

### 2. **Chofer**
- Acceso a vista móvil
- Ve sus repartos asignados
- Marca entregas como completadas
- Registra gastos de ruta

---

## 🆕 Crear un Chofer (con cuenta de usuario)

### Proceso:

1. **Admin va a:** Sidebar → Choferes → "Nuevo Chofer"

2. **Completa el formulario:**
   ```
   Nombre: Juan Pérez
   DNI: 12345678
   CUIL: 20-12345678-9
   Fecha de Nacimiento: 15/05/1985
   Email: juan.perez@empresa.com  ← IMPORTANTE
   Contraseña: chofer123          ← IMPORTANTE (mínimo 6 caracteres)
   Celular: 1234567890
   Domicilio: Calle Falsa 123
   ```

3. **Click en "Crear"**

4. **El sistema automáticamente:**
   - ✅ Crea la cuenta en Firebase Authentication
   - ✅ Crea el documento del chofer en Firestore
   - ✅ Vincula la cuenta con el chofer (userId)
   - ✅ Asigna el rol "chofer"
   - ✅ Muestra un alert con las credenciales

5. **Alert de confirmación:**
   ```
   ✅ Chofer creado exitosamente!

   📧 Email: juan.perez@empresa.com
   🔑 Contraseña: chofer123

   ⚠️ Guarda estas credenciales y compártelas con el chofer.
   ```

---

## 🔑 Credenciales del Chofer

### El admin debe:

1. **Copiar las credenciales** del alert
2. **Enviarlas al chofer** por:
   - WhatsApp
   - Email
   - SMS
   - En persona

### Ejemplo de mensaje:
```
Hola Juan,

Tu cuenta de FleetFlow está lista:

📧 Usuario: juan.perez@empresa.com
🔑 Contraseña: chofer123

Ingresa en: https://fleetflow.app/login

Saludos,
Administración
```

---

## 📱 Login del Chofer

### Proceso:

1. **Chofer abre la app:** `https://fleetflow.app/login`

2. **Ingresa sus credenciales:**
   - Email: `juan.perez@empresa.com`
   - Contraseña: `chofer123`

3. **Click en "Ingresar"**

4. **El sistema:**
   - ✅ Valida las credenciales
   - ✅ Identifica que es un chofer (por el rol)
   - ✅ Redirige a `/chofer` (vista móvil)
   - ✅ Muestra sus repartos asignados

---

## 🔄 Flujo Completo

```
┌─────────────────────────────────────────────────────────┐
│  ADMIN                                                  │
├─────────────────────────────────────────────────────────┤
│  1. Crear Chofer                                        │
│     ├─ Nombre, DNI, Email, etc.                        │
│     └─ Contraseña temporal                             │
│                                                         │
│  2. Sistema crea:                                       │
│     ├─ Cuenta en Firebase Auth                         │
│     └─ Documento en Firestore                          │
│                                                         │
│  3. Admin recibe credenciales                           │
│     └─ Las envía al chofer                             │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  CHOFER                                                 │
├─────────────────────────────────────────────────────────┤
│  1. Recibe credenciales                                 │
│     ├─ Email: juan@empresa.com                         │
│     └─ Password: chofer123                             │
│                                                         │
│  2. Ingresa a /login                                    │
│     └─ Introduce email y password                      │
│                                                         │
│  3. Sistema lo redirige a /chofer                       │
│     └─ Ve sus repartos y entregas                      │
└─────────────────────────────────────────────────────────┘
```

---

## 🛡️ Seguridad

### Validaciones implementadas:

✅ **Email único:** No se puede crear dos cuentas con el mismo email
✅ **Contraseña mínima:** 6 caracteres obligatorios
✅ **Vinculación:** Cada chofer tiene un userId único
✅ **Rol asignado:** Automáticamente se asigna rol "chofer"

### Mensajes de error:

- **Email ya existe:** "Este email ya está registrado. Usa otro email."
- **Contraseña corta:** "La contraseña debe tener al menos 6 caracteres"
- **Campos vacíos:** "Email y contraseña son obligatorios"

---

## ✏️ Editar un Chofer

### Importante:

- Al **editar** un chofer existente, NO se pide contraseña
- Solo se actualizan los datos del chofer (nombre, DNI, etc.)
- La cuenta de Firebase NO se modifica
- El chofer sigue usando su email y contraseña original

### Para cambiar la contraseña:

El chofer debe usar la opción "¿Olvidaste tu contraseña?" en el login.

---

## 🔍 Verificar que funciona

### Prueba completa:

1. **Como Admin:**
   - Crear un chofer con email: `test.chofer@test.com` y password: `test123`
   - Copiar las credenciales del alert

2. **Cerrar sesión** (botón "Cerrar Sesión" en sidebar)

3. **Como Chofer:**
   - Ir a `/login`
   - Ingresar: `test.chofer@test.com` / `test123`
   - Verificar que redirige a `/chofer`
   - Ver la lista de repartos

4. **Listo!** ✅

---

## 📝 Notas Importantes

### ⚠️ Contraseñas temporales:

- El admin ve la contraseña en texto plano (solo al crear)
- **Recomendación:** Usar contraseñas simples y pedir al chofer que la cambie
- Ejemplo: `chofer123`, `temporal2024`, `cambiar123`

### 🔄 Cambio de contraseña:

Para que el chofer cambie su contraseña:
1. Cerrar sesión
2. Click en "¿Olvidaste tu contraseña?"
3. Ingresar su email
4. Firebase enviará un email de recuperación

### 🗑️ Eliminar un chofer:

Si eliminas un chofer desde el admin:
- ✅ Se elimina el documento de Firestore
- ❌ La cuenta de Firebase Auth NO se elimina automáticamente
- El usuario aún puede hacer login pero no tendrá datos asociados

---

## 🎯 Mejoras Futuras (Opcional)

1. **Generador de contraseñas:** Crear contraseñas aleatorias seguras
2. **Envío automático de email:** Enviar credenciales por email automáticamente
3. **Cambio de contraseña en la app:** Permitir cambiar password desde el perfil
4. **Roles avanzados:** Admin, Supervisor, Chofer
5. **Permisos granulares:** Qué puede ver/hacer cada rol

---

## 📞 Soporte

Si tienes problemas:
1. Verificar que el email no esté ya registrado
2. Verificar que la contraseña tenga al menos 6 caracteres
3. Revisar la consola del navegador (F12) para ver errores
4. Verificar que Firebase Authentication esté habilitado en la consola

---

**Última actualización:** 28/11/2024
