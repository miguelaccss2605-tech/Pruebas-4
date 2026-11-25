// Utilidades compartidas por los 4 programas

function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// casos: [{ nombre, esperado, obtenido }]
function mostrarPruebas(casos, idContenedor) {
  let html = "<table><tr><th>Prueba</th><th>Esperado</th><th>Obtenido</th><th>Resultado</th></tr>";
  let pasaron = 0;
  for (let i = 0; i < casos.length; i++) {
    const c = casos[i];
    const paso = c.esperado === c.obtenido;
    if (paso) pasaron++;
    html += "<tr><td>" + escaparHtml(c.nombre) + "</td><td>" + escaparHtml(c.esperado) +
      "</td><td>" + escaparHtml(c.obtenido) + "</td><td class='" + (paso ? "ok" : "mal") +
      "'>" + (paso ? "PASÓ" : "FALLÓ") + "</td></tr>";
  }
  html += "</table><p><b>" + pasaron + " de " + casos.length + " pruebas pasaron.</b></p>";
  document.getElementById(idContenedor).innerHTML = html;
}
