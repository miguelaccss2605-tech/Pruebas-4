// GRUPO 11: interfaz (la lógica está en logica11.js)

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

