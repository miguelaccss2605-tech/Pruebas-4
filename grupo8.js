// GRUPO 8: Evaluador de crédito hipotecario

const SUELDO_MINIMO = 2000;
const EDAD_MIN = 21;
const EDAD_MAX = 65;
const LIMITE_CUOTA = 0.30;
const EPSILON = 1e-9; // evita errores de decimales al comparar 30.0%

// Devuelve { decision, motivo, ruta }.
// 'ruta' indica por dónde salió la función (sirve para probar el cortocircuito).
function evaluarCredito(sueldo, edad, historial, monto, plazoMeses) {
  // Salida rápida: si el historial es Malo, no se evalúa nada más.
  if (historial === "Malo") {
    return { decision: "Rechazado", motivo: "Historial crediticio malo", ruta: "cortocircuito-historial" };
  }

  // Cortocircuito con ||: si edad < 21 es verdadero, ya no evalúa edad > 65.
  if (edad < EDAD_MIN || edad > EDAD_MAX) {
    return { decision: "Rechazado", motivo: "Edad fuera del rango permitido (21 a 65)", ruta: "edad" };
  }

  const cuota = monto / plazoMeses;

  // Cortocircuito con &&: si el sueldo no alcanza, no calcula el porcentaje de cuota.
  if (sueldo >= SUELDO_MINIMO && cuota <= sueldo * LIMITE_CUOTA + EPSILON) {
    return { decision: "Aprobado", motivo: "Cumple todos los requisitos", ruta: "aprobado" };
  }

  return { decision: "Rechazado", motivo: "Sueldo insuficiente o cuota mayor al 30% del sueldo", ruta: "capacidad-pago" };
}

// ----- Interfaz -----
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
  const pct = (cuota / sueldo * 100).toFixed(1);
  cont.innerHTML = "<b class='" + (r.decision === "Aprobado" ? "ok" : "mal") + "'>" + r.decision + "</b><br>" +
    escaparHtml(r.motivo) + "<br>Cuota mensual: $" + cuota.toFixed(2) + " (" + pct + "% del sueldo)";
});

// ----- Pruebas -----
document.getElementById("probar").addEventListener("click", function () {
  const casos = [];

  // Caja blanca: salida rápida cuando el historial es Malo
  const malo = evaluarCredito(5000, 18, "Malo", 1000, 100); // edad inválida, pero Malo manda
  casos.push({ nombre: "Historial Malo: sale antes de evaluar edad", esperado: "cortocircuito-historial", obtenido: malo.ruta });
  casos.push({ nombre: "Historial Malo con todo lo demás perfecto", esperado: "Rechazado", obtenido: evaluarCredito(9999, 30, "Malo", 100, 100).decision });
  casos.push({ nombre: "Historial Bueno sí sigue evaluando", esperado: "aprobado", obtenido: evaluarCredito(3000, 30, "Bueno", 1200, 12).ruta });

  // Caja negra: fronteras de edad (sueldo y cuota correctos)
  const edades = [[20, "Rechazado"], [21, "Aprobado"], [65, "Aprobado"], [66, "Rechazado"]];
  for (let i = 0; i < edades.length; i++) {
    casos.push({
      nombre: "Frontera de edad: " + edades[i][0] + " años",
      esperado: edades[i][1],
      obtenido: evaluarCredito(3000, edades[i][0], "Bueno", 1000, 12).decision
    });
  }

  // Caja negra: fronteras de capacidad de pago (sueldo 2000, plazo 12 meses)
  const sueldo = 2000, plazo = 12;
  const cuotas = [[0.299, "Aprobado"], [0.300, "Aprobado"], [0.301, "Rechazado"]];
  for (let i = 0; i < cuotas.length; i++) {
    const monto = sueldo * cuotas[i][0] * plazo;
    casos.push({
      nombre: "Cuota = " + (cuotas[i][0] * 100).toFixed(1) + "% del sueldo",
      esperado: cuotas[i][1],
      obtenido: evaluarCredito(sueldo, 30, "Excelente", monto, plazo).decision
    });
  }

  // Frontera del sueldo mínimo
  casos.push({ nombre: "Sueldo $1999 (bajo el mínimo)", esperado: "Rechazado", obtenido: evaluarCredito(1999, 30, "Bueno", 100, 12).decision });
  casos.push({ nombre: "Sueldo $2000 (mínimo)", esperado: "Aprobado", obtenido: evaluarCredito(2000, 30, "Bueno", 100, 12).decision });

  mostrarPruebas(casos, "pruebas");
});
