import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  Timestamp 
} from "firebase/firestore";
import { db } from "../firebase/config";

// ============ CHOFERES ============
export const getChoferes = async () => {
  const querySnapshot = await getDocs(collection(db, "choferes"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getChoferById = async (id) => {
  const docRef = doc(db, "choferes", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const createChofer = async (choferData) => {
  const docRef = await addDoc(collection(db, "choferes"), {
    ...choferData,
    FechaNac: choferData.FechaNac ? Timestamp.fromDate(new Date(choferData.FechaNac)) : null
  });
  return docRef.id;
};

export const updateChofer = async (id, choferData) => {
  const docRef = doc(db, "choferes", id);
  await updateDoc(docRef, {
    ...choferData,
    FechaNac: choferData.FechaNac ? Timestamp.fromDate(new Date(choferData.FechaNac)) : null
  });
};

export const deleteChofer = async (id) => {
  await deleteDoc(doc(db, "choferes", id));
};

export const getChoferByUserId = async (userId) => {
  const q = query(
    collection(db, "choferes"), 
    where("userId", "==", userId)
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  const doc = querySnapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

// ============ FLOTA ============
export const getFlota = async () => {
  const querySnapshot = await getDocs(collection(db, "flota"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getVehiculoById = async (id) => {
  const docRef = doc(db, "flota", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const createVehiculo = async (vehiculoData) => {
  const docRef = await addDoc(collection(db, "flota"), vehiculoData);
  return docRef.id;
};

export const updateVehiculo = async (id, vehiculoData) => {
  const docRef = doc(db, "flota", id);
  await updateDoc(docRef, vehiculoData);
};

export const deleteVehiculo = async (id) => {
  await deleteDoc(doc(db, "flota", id));
};

// ============ ZONAS ============
export const getZonas = async () => {
  const querySnapshot = await getDocs(collection(db, "zonas"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createZona = async (zonaData) => {
  const docRef = await addDoc(collection(db, "zonas"), zonaData);
  return docRef.id;
};

export const updateZona = async (id, zonaData) => {
  const docRef = doc(db, "zonas", id);
  await updateDoc(docRef, zonaData);
};

export const deleteZona = async (id) => {
  await deleteDoc(doc(db, "zonas", id));
};

// ============ CLIENTES ============
export const getClientes = async () => {
  const querySnapshot = await getDocs(collection(db, "clientes"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getClienteById = async (id) => {
  const docRef = doc(db, "clientes", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const createCliente = async (clienteData) => {
  const docRef = await addDoc(collection(db, "clientes"), clienteData);
  return docRef.id;
};

export const updateCliente = async (id, clienteData) => {
  const docRef = doc(db, "clientes", id);
  await updateDoc(docRef, clienteData);
};

export const deleteCliente = async (id) => {
  await deleteDoc(doc(db, "clientes", id));
};

// ============ REPARTOS ============
export const getRepartos = async () => {
  const querySnapshot = await getDocs(
    query(collection(db, "repartos"), orderBy("Fecha", "desc"))
  );
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getRepartoById = async (id) => {
  const docRef = doc(db, "repartos", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const getRepartosByChofer = async (choferId) => {
  const q = query(
    collection(db, "repartos"), 
    where("IdChofer", "==", choferId)
  );
  const querySnapshot = await getDocs(q);
  const repartos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Ordenar en cliente para evitar error de índice compuesto en Firestore
  return repartos.sort((a, b) => {
    const fechaA = a.Fecha?.toDate ? a.Fecha.toDate() : new Date(a.Fecha);
    const fechaB = b.Fecha?.toDate ? b.Fecha.toDate() : new Date(b.Fecha);
    return fechaB - fechaA; // Orden descendente (más reciente primero)
  });
};

export const createReparto = async (repartoData) => {
  const docRef = await addDoc(collection(db, "repartos"), {
    ...repartoData,
    Fecha: repartoData.Fecha ? Timestamp.fromDate(new Date(repartoData.Fecha)) : Timestamp.now(),
    CantidadReparto: repartoData.CantidadReparto || 0,
    TotalReparto: repartoData.TotalReparto || 0,
    estado_global: repartoData.estado_global || 'PENDIENTE',
    items_entrega: repartoData.items_entrega || [],
    gastos_ruta: repartoData.gastos_ruta || [],
    balance: repartoData.balance || {
      total_a_cobrar: 0,
      total_gastado: 0,
      total_rendido: 0
    }
  });
  return docRef.id;
};

export const updateReparto = async (id, repartoData) => {
  const docRef = doc(db, "repartos", id);
  await updateDoc(docRef, {
    ...repartoData,
    Fecha: repartoData.Fecha ? Timestamp.fromDate(new Date(repartoData.Fecha)) : undefined
  });
};

export const deleteReparto = async (id) => {
  await deleteDoc(doc(db, "repartos", id));
};

// ============ DETALLE REPARTO ============
export const getDetallesByReparto = async (repartoId) => {
  const q = query(
    collection(db, "detalleReparto"),
    where("IdReparto", "==", repartoId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createDetalleReparto = async (detalleData) => {
  const docRef = await addDoc(collection(db, "detalleReparto"), {
    ...detalleData,
    Fecha: detalleData.Fecha ? Timestamp.fromDate(new Date(detalleData.Fecha)) : Timestamp.now()
  });
  return docRef.id;
};

export const updateDetalleReparto = async (id, detalleData) => {
  const docRef = doc(db, "detalleReparto", id);
  await updateDoc(docRef, {
    ...detalleData,
    Fecha: detalleData.Fecha ? Timestamp.fromDate(new Date(detalleData.Fecha)) : undefined
  });
};

export const deleteDetalleReparto = async (id) => {
  await deleteDoc(doc(db, "detalleReparto", id));
};

// ============ FUNCIONES OPTIMIZADAS PARA ARRAYS ============

// Actualizar estado de un item de entrega dentro del array
export const updateItemStatus = async (repartoId, itemId, newStatus, motivoFallo = "") => {
  const docRef = doc(db, "repartos", repartoId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    throw new Error("Reparto no encontrado");
  }
  
  const repartoData = docSnap.data();
  const items = repartoData.items_entrega || [];
  
  // Buscar y actualizar el item
  const updatedItems = items.map(item => {
    if (item.id === itemId) {
      return {
        ...item,
        estado: newStatus,
        motivo_fallo: motivoFallo,
        hora_visita: Timestamp.now()
      };
    }
    return item;
  });
  
  // Actualizar el documento
  await updateDoc(docRef, {
    items_entrega: updatedItems
  });
};

// Agregar un gasto a la ruta
export const addGastoRuta = async (repartoId, gastoData) => {
  const docRef = doc(db, "repartos", repartoId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    throw new Error("Reparto no encontrado");
  }
  
  const repartoData = docSnap.data();
  const gastosActuales = repartoData.gastos_ruta || [];
  const balanceActual = repartoData.balance || { total_a_cobrar: 0, total_gastado: 0, total_rendido: 0 };
  
  // Agregar nuevo gasto
  const nuevoGasto = {
    ...gastoData,
    id: `gasto_${Date.now()}`,
    fecha: Timestamp.now()
  };
  
  const nuevosGastos = [...gastosActuales, nuevoGasto];
  const totalGastado = nuevosGastos.reduce((sum, g) => sum + (g.monto || 0), 0);
  
  // Actualizar balance
  const nuevoBalance = {
    ...balanceActual,
    total_gastado: totalGastado,
    total_rendido: balanceActual.total_a_cobrar - totalGastado
  };
  
  // Actualizar documento
  await updateDoc(docRef, {
    gastos_ruta: nuevosGastos,
    balance: nuevoBalance
  });
  
  // Si el gasto tiene km_registrado, actualizar la flota
  if (gastoData.km_registrado && repartoData.flota?.id) {
    const flotaRef = doc(db, "flota", repartoData.flota.id);
    await updateDoc(flotaRef, {
      Km: gastoData.km_registrado
    });
  }
  
  return nuevoGasto.id;
};
