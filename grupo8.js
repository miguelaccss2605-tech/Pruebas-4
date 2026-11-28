// GRUPO 8: interfaz (la lógica está en logica8.js)

document.getElementById("evaluar").addEventListener("click", function () {
  const sueldo = parseFloat(document.getElementById("sueldo").value);
  const edad = parseInt(document.getElementById("edad").value, 10);
  const historial = document.getElementById("historial").value;
  const monto = parseFloat(document.getElementById("monto").value);
  const plazo = parseInt(document.getElementById("plazo").value, 10);
  const cont = document.getElementById("salida");

  if ([sueldo, edad, monto, plazo].some(isNaN) || plazo < 1) {
    cont.innerHTML = "<span class='mal'>Completa todos los campos con valores válidos.</span>";
    return;
  }

  const r = evaluarCredito(sueldo, edad, historial, monto, plazo);
  const cuota = monto / plazo;
  const pct = sueldo > 0 ? (cuota / sueldo * 100).toFixed(1) + "% del sueldo" : "sin sueldo";
  cont.innerHTML = "<b class='" + (r.decision === "Aprobado" ? "ok" : "mal") + "'>" + r.decision + "</b><br>" +
    escaparHtml(r.motivo) + "<br>Cuota mensual: $" + cuota.toFixed(2) + " (" + pct + ")";
});
