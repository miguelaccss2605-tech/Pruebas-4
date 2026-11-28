// GRUPO 31: lógica del inventario de farmacia (sin interfaz)

function inventarioInicial() {
  return {
    "Paracetamol 500mg": { stock: 50, requiereReceta: false },
    "Ibuprofeno 400mg": { stock: 20, requiereReceta: false },
    "Amoxicilina 500mg": { stock: 10, requiereReceta: true },
    "Loratadina 10mg": { stock: 5, requiereReceta: false }
  };
}

// Tres ramas: rechazada por receta, venta parcial por stock, venta completa.
function procesarVenta(db, medicamento, cantidad, requiereReceta, presentaReceta) {
  const item = db[medicamento];
  if (!item) {
    return { estado: "Error", mensaje: "El medicamento no existe en el inventario." };
  }

  if (requiereReceta && !presentaReceta) {
    return { estado: "Rechazada", mensaje: "Venta rechazada: el medicamento requiere receta médica." };
  }

  if (item.stock < cantidad) {
    return {
      estado: "Parcial",
      mensaje: "Venta parcial: solo hay " + item.stock + " unidad(es) disponibles de " + cantidad + " solicitadas."
    };
  }

  item.stock = item.stock - cantidad; // actualizar stock en la DB
  return { estado: "Completa", mensaje: "Venta completada. Stock restante: " + item.stock + "." };
}

if (typeof module !== "undefined") module.exports = { inventarioInicial, procesarVenta };
