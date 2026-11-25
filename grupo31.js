// GRUPO 31: Control de inventario de farmacia

function inventarioInicial() {
  return {
    "Paracetamol 500mg": { stock: 50, requiereReceta: false },
    "Ibuprofeno 400mg": { stock: 20, requiereReceta: false },
    "Amoxicilina 500mg": { stock: 10, requiereReceta: true },
    "Loratadina 10mg": { stock: 5, requiereReceta: false }
  };
}

// Simula la "DB" con localStorage
let inventario;
try {
  inventario = JSON.parse(localStorage.getItem("farmasalud")) || inventarioInicial();
} catch (e) {
  inventario = inventarioInicial();
}
function guardarDB() {
  try { localStorage.setItem("farmasalud", JSON.stringify(inventario)); } catch (e) {}
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

// ----- Interfaz -----
function dibujarInventario() {
  let html = "<table><tr><th>Medicamento</th><th>Stock</th><th>Requiere receta</th></tr>";
  const nombres = Object.keys(inventario);
  for (let i = 0; i < nombres.length; i++) {
    const n = nombres[i];
    html += "<tr><td>" + escaparHtml(n) + "</td><td>" + inventario[n].stock + "</td><td>" +
      (inventario[n].requiereReceta ? "Sí" : "No") + "</td></tr>";
  }
  document.getElementById("inventario").innerHTML = html + "</table>";

  const sel = document.getElementById("medicamento");
  const actual = sel.value;
  sel.innerHTML = "";
  for (let i = 0; i < nombres.length; i++) {
    const op = document.createElement("option");
    op.textContent = nombres[i];
    sel.appendChild(op);
  }
  if (actual && inventario[actual]) sel.value = actual;
}

document.getElementById("vender").addEventListener("click", function () {
  const med = document.getElementById("medicamento").value;
  const cant = parseInt(document.getElementById("cantidad").value, 10);
  const receta = document.getElementById("presentaReceta").value === "true";
  const cont = document.getElementById("salida");

  if (isNaN(cant) || cant < 1) {
    cont.innerHTML = "<span class='mal'>La cantidad debe ser al menos 1.</span>";
    return;
  }
  const r = procesarVenta(inventario, med, cant, inventario[med].requiereReceta, receta);
  const clase = r.estado === "Completa" ? "ok" : (r.estado === "Parcial" ? "aviso" : "mal");
  cont.innerHTML = "<b class='" + clase + "'>" + r.estado + "</b><br>" + escaparHtml(r.mensaje);
  guardarDB();
  dibujarInventario();
});

document.getElementById("reiniciar").addEventListener("click", function () {
  inventario = inventarioInicial();
  guardarDB();
  dibujarInventario();
  document.getElementById("salida").innerHTML = "";
});

// ----- Pruebas (usan una DB aparte para no tocar el inventario real) -----
document.getElementById("probar").addEventListener("click", function () {
  const casos = [];
  const nueva = function (stock, receta) {
    return { "Med": { stock: stock, requiereReceta: receta } };
  };

  // Caja blanca: las 3 ramas
  casos.push({ nombre: "Rama 1: requiere receta y no la presenta", esperado: "Rechazada", obtenido: procesarVenta(nueva(10, true), "Med", 1, true, false).estado });
  casos.push({ nombre: "Rama 2: stock menor a lo pedido", esperado: "Parcial", obtenido: procesarVenta(nueva(3, false), "Med", 5, false, false).estado });
  casos.push({ nombre: "Rama 3: venta aprobada", esperado: "Completa", obtenido: procesarVenta(nueva(10, false), "Med", 2, false, false).estado });
  casos.push({ nombre: "Con receta presentada se aprueba", esperado: "Completa", obtenido: procesarVenta(nueva(10, true), "Med", 2, true, true).estado });

  // Caja negra: fronteras de stock (stock_actual = 10)
  const stockActual = 10;
  const pedidos = [[stockActual - 1, "Completa"], [stockActual, "Completa"], [stockActual + 1, "Parcial"]];
  for (let i = 0; i < pedidos.length; i++) {
    casos.push({
      nombre: "Pedir " + pedidos[i][0] + " con stock " + stockActual,
      esperado: pedidos[i][1],
      obtenido: procesarVenta(nueva(stockActual, false), "Med", pedidos[i][0], false, false).estado
    });
  }

  // El stock se actualiza solo cuando la venta se completa
  const db = nueva(10, false);
  procesarVenta(db, "Med", 10, false, false);
  casos.push({ nombre: "Tras vender todo, stock queda en 0", esperado: "0", obtenido: String(db.Med.stock) });
  const db2 = nueva(10, false);
  procesarVenta(db2, "Med", 11, false, false);
  casos.push({ nombre: "En venta parcial el stock no cambia", esperado: "10", obtenido: String(db2.Med.stock) });

  mostrarPruebas(casos, "pruebas");
});

dibujarInventario();
