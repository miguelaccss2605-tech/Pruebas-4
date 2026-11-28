// GRUPO 32: lógica de reservas de cubículos (sin interfaz)

const HORAS_MAX = 2;

// Condiciones compuestas: tamaño del cubículo vs. número de integrantes.
function evaluarReserva(tipo, alumnos, horas) {
  if (horas < 1 || horas > HORAS_MAX) {
    return { aprobada: false, mensaje: "Rechazada: las horas deben estar entre 1 y " + HORAS_MAX + "." };
  }

  if (tipo === "pequeño" && alumnos < 2) {
    return { aprobada: false, mensaje: "Rechazada: el cubículo pequeño requiere mínimo 2 personas." };
  } else if (tipo === "grande" && alumnos < 5) {
    return { aprobada: false, mensaje: "Rechazada: el cubículo grande requiere mínimo 5 personas." };
  } else if (tipo !== "pequeño" && tipo !== "grande") {
    return { aprobada: false, mensaje: "Rechazada: tipo de cubículo no válido." };
  }

  return { aprobada: true, mensaje: "Reserva aprobada." };
}

if (typeof module !== "undefined") module.exports = { evaluarReserva };
