// GRUPO 31: interfaz (la lógica está en logica31.js)

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

dibujarInventario();
