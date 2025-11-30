import { collection, doc, setDoc, writeBatch } from "firebase/firestore";
import { db } from "../firebase/config";

export const seedDatabase = async () => {
  console.log("Iniciando seeding...");
  const batch = writeBatch(db);

  // 1. Zonas
  const zonas = [
    { id: "zona_norte", Zona: "Zona Norte" },
    { id: "zona_sur", Zona: "Zona Sur" },
    { id: "zona_centro", Zona: "Centro" }
  ];

  zonas.forEach(zona => {
    const ref = doc(collection(db, "zonas"), zona.id);
    batch.set(ref, { Zona: zona.Zona });
  });

  // 2. Choferes
  const choferes = [
    { 
      id: "chofer_1", 
      Nombre: "Juan Pérez", 
      Dni: "12345678", 
      Cuil: "20-12345678-9",
      Domicilio: "Calle Falsa 123",
      email: "juan.perez@example.com",
      Celular: "1234567890",
      FechaNac: new Date("1985-05-15")
    },
    { 
      id: "chofer_2", 
      Nombre: "Carlos Gómez", 
      Dni: "87654321", 
      Cuil: "20-87654321-9",
      Domicilio: "Av. Siempre Viva 456",
      email: "carlos.gomez@example.com",
      Celular: "0987654321",
      FechaNac: new Date("1990-08-20")
    },
    { 
      id: "chofer_3", 
      Nombre: "Ana López", 
      Dni: "11223344", 
      Cuil: "27-11223344-5",
      Domicilio: "Pasaje Los Álamos 789",
      email: "ana.lopez@example.com",
      Celular: "1122334455",
      FechaNac: new Date("1988-12-10")
    }
  ];

  choferes.forEach(chofer => {
    const { id, ...data } = chofer;
    const ref = doc(collection(db, "choferes"), id);
    batch.set(ref, data);
  });

  // 3. Flota
  const flota = [
    { 
      id: "vehiculo_1", 
      Marca: "Iveco Daily", 
      Dominio: "AA-123-BB", 
      Km: 50000, 
      Hs: 2500,
      Nomesc: "Camión de carga mediana"
    },
    { 
      id: "vehiculo_2", 
      Marca: "Mercedes Sprinter", 
      Dominio: "CC-456-DD", 
      Km: 120000, 
      Hs: 5000,
      Nomesc: "Van de reparto"
    },
    { 
      id: "vehiculo_3", 
      Marca: "Toyota Hilux", 
      Dominio: "EE-789-FF", 
      Km: 30000, 
      Hs: 1200,
      Nomesc: "Camioneta 4x4"
    }
  ];

  flota.forEach(vehiculo => {
    const { id, ...data } = vehiculo;
    const ref = doc(collection(db, "flota"), id);
    batch.set(ref, data);
  });

  // 4. Clientes
  const clientes = [];
  const nombresClientes = [
    "Kiosco Pepe", "Supermercado Central", "Almacén Don José",
    "Panadería La Esquina", "Verdulería Fresh", "Carnicería El Buen Corte",
    "Restaurante El Fogón", "Bar La Estación", "Pizzería Napolitana",
    "Heladería Cremosa"
  ];

  nombresClientes.forEach((nombre, i) => {
    const zona = zonas[Math.floor(Math.random() * zonas.length)];
    clientes.push({
      id: `cliente_${i + 1}`,
      Nombre: nombre,
      RazonSocial: `${nombre} S.R.L.`,
      Cuit: `30-${10000000 + i}-${i}`,
      Contacto: `Contacto ${i + 1}`,
      email: `contacto${i + 1}@${nombre.toLowerCase().replace(/\s/g, '')}.com`,
      DomicilioFiscal: `Calle ${i * 100} N° ${i + 1}`,
      DomicilioEntrega: `Calle ${i * 100} N° ${i + 1}`,
      IdZona: zona.id
    });
  });

  clientes.forEach(cliente => {
    const { id, ...data } = cliente;
    const ref = doc(collection(db, "clientes"), id);
    batch.set(ref, data);
  });

  // 5. Repartos de Prueba
  const repartos = [
    {
      id: "reparto_test_1",
      Fecha: new Date(),
      Obsercacion: "Reparto de prueba 1",
      TotalReparto: 4000.50,
      CantidadReparto: 2,
      IdChofer: choferes[0].id,
      IdFlota: flota[0].id
    },
    {
      id: "reparto_test_2",
      Fecha: new Date(),
      Obsercacion: "Reparto de prueba 2",
      TotalReparto: 1000,
      CantidadReparto: 1,
      IdChofer: choferes[1].id,
      IdFlota: flota[1].id
    }
  ];

  repartos.forEach(reparto => {
    const { id, ...data } = reparto;
    const ref = doc(collection(db, "repartos"), id);
    batch.set(ref, data);
  });

  // 6. Detalles de Reparto
  const detalles = [
    {
      id: "detalle_1",
      IdReparto: "reparto_test_1",
      IdOrden: 1,
      NroFactura: "A-0001-00000001",
      NroRemito: "R-0001",
      Fecha: new Date(),
      IdCliente: clientes[0].id,
      Importe: 1500.50,
      DomicilioEntrega: clientes[0].DomicilioEntrega,
      IdZona: clientes[0].IdZona
    },
    {
      id: "detalle_2",
      IdReparto: "reparto_test_1",
      IdOrden: 2,
      NroFactura: "A-0001-00000002",
      NroRemito: "R-0002",
      Fecha: new Date(),
      IdCliente: clientes[1].id,
      Importe: 2500.00,
      DomicilioEntrega: clientes[1].DomicilioEntrega,
      IdZona: clientes[1].IdZona
    },
    {
      id: "detalle_3",
      IdReparto: "reparto_test_2",
      IdOrden: 1,
      NroFactura: "B-0001-00000001",
      NroRemito: "R-0003",
      Fecha: new Date(),
      IdCliente: clientes[2].id,
      Importe: 1000,
      DomicilioEntrega: clientes[2].DomicilioEntrega,
      IdZona: clientes[2].IdZona
    }
  ];

  detalles.forEach(detalle => {
    const { id, ...data } = detalle;
    const ref = doc(collection(db, "detalleReparto"), id);
    batch.set(ref, data);
  });

  await batch.commit();
  console.log("Seeding completado exitosamente.");
};
