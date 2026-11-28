// GRUPO 8: lógica del evaluador de crédito hipotecario (sin interfaz)

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

if (typeof module !== "undefined") module.exports = { evaluarCredito };
