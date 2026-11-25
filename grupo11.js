// GRUPO 11: Gestor de cobro recurrente

// Recorre el arreglo con un ciclo 'for' y aplica condicionales según días de mora.
function procesarCobros(usuarios) {
  const resultados = [];
  for (let i = 0; i < usuarios.length; i++) {
    const u = usuarios[i];
    let estado;
    let recargo = 0;

    if (u.diasMora === 0) {
      estado = "Activo";
    } else if (u.diasMora >= 1 && u.diasMora <= 15) {
      estado = "Aviso de Cobro";
      recargo = 0.05;
    } else if (u.diasMora >= 16 && u.diasMora <= 30) {
      estado = "Suspendido";
      recargo = 0.10;
    } else {
      estado = "Cancelado / Cobranza judicial";
    }

    const total = u.cuota + u.cuota * recargo;
    resultados.push({
      nombre: u.nombre,
      diasMora: u.diasMora,
      estado: estado,
      recargo: recargo * 100,
      total: total
    });
  }
  return resultados;
}

// ----- Interfaz -----
let clientes = [];

function dibujarSalida(resultados) {
  const cont = document.getElementById("salida");
  if (resultados.length === 0) {
    cont.textContent = "La lista está vacía.";
    return;
  }
  let html = "<table><tr><th>Cliente</th><th>Días mora</th><th>Estado</th><th>Recargo</th><th>Total a pagar</th></tr>";
  for (let i = 0; i < resultados.length; i++) {
    const r = resultados[i];
    const clase = r.estado === "Activo" ? "ok" : (r.estado === "Aviso de Cobro" ? "aviso" : "mal");
    html += "<tr><td>" + escaparHtml(r.nombre) + "</td><td>" + r.diasMora + "</td><td class='" + clase + "'>" +
      escaparHtml(r.estado) + "</td><td>" + r.recargo + "%</td><td>$" + r.total.toFixed(2) + "</td></tr>";
  }
  cont.innerHTML = html + "</table>";
}

document.getElementById("agregar").addEventListener("click", function () {
  const nombre = document.getElementById("nombre").value.trim();
  const cuota = parseFloat(document.getElementById("cuota").value);
  const mora = parseInt(document.getElementById("mora").value, 10);
  if (!nombre || isNaN(cuota) || isNaN(mora) || cuota < 0 || mora < 0) {
    alert("Completa nombre, cuota y días de mora válidos (no negativos).");
    return;
  }
  clientes.push({ nombre: nombre, cuota: cuota, diasMora: mora });
  document.getElementById("nombre").value = "";
  dibujarSalida(procesarCobros(clientes));
});

document.getElementById("ejemplo").addEventListener("click", function () {
  clientes = [
    { nombre: "Ana", cuota: 20, diasMora: 0 },
    { nombre: "Luis", cuota: 20, diasMora: 10 },
    { nombre: "María", cuota: 35, diasMora: 20 },
    { nombre: "Pedro", cuota: 15, diasMora: 45 }
  ];
  dibujarSalida(procesarCobros(clientes));
});

document.getElementById("vaciar").addEventListener("click", function () {
  clientes = [];
  dibujarSalida([]);
});

document.getElementById("procesar").addEventListener("click", function () {
  dibujarSalida(procesarCobros(clientes));
});

// ----- Pruebas -----
document.getElementById("probar").addEventListener("click", function () {
  const casos = [];

  // Caja blanca: comportamiento del ciclo 'for'
  casos.push({ nombre: "Lista vacía (0 iteraciones)", esperado: "0", obtenido: String(procesarCobros([]).length) });
  const uno = procesarCobros([{ nombre: "A", cuota: 10, diasMora: 0 }]);
  casos.push({ nombre: "1 usuario (1 iteración)", esperado: "1", obtenido: String(uno.length) });
  const varios = procesarCobros([
    { nombre: "A", cuota: 10, diasMora: 0 },
    { nombre: "B", cuota: 10, diasMora: 5 },
    { nombre: "C", cuota: 10, diasMora: 20 }
  ]);
  casos.push({ nombre: "Múltiples usuarios (3 iteraciones)", esperado: "3", obtenido: String(varios.length) });

  // Caja negra: fronteras de días de mora
  const fronteras = [
    [0, "Activo"], [1, "Aviso de Cobro"], [15, "Aviso de Cobro"],
    [16, "Suspendido"], [30, "Suspendido"], [31, "Cancelado / Cobranza judicial"]
  ];
  for (let i = 0; i < fronteras.length; i++) {
    const r = procesarCobros([{ nombre: "T", cuota: 100, diasMora: fronteras[i][0] }])[0];
    casos.push({ nombre: "Frontera: " + fronteras[i][0] + " días", esperado: fronteras[i][1], obtenido: r.estado });
  }

  // Recargos
  casos.push({ nombre: "Recargo 5% sobre $100 (mora 1)", esperado: "105.00", obtenido: procesarCobros([{ nombre: "T", cuota: 100, diasMora: 1 }])[0].total.toFixed(2) });
  casos.push({ nombre: "Recargo 10% sobre $100 (mora 16)", esperado: "110.00", obtenido: procesarCobros([{ nombre: "T", cuota: 100, diasMora: 16 }])[0].total.toFixed(2) });

  mostrarPruebas(casos, "pruebas");
});
