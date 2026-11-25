// GRUPO 32: Gestor de reservas de cubículos

const HORAS_MAX = 2;
const MINIMO = { "pequeño": 2, "grande": 5 };

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

// ----- Interfaz -----
const reservas = [];

function dibujarReservas() {
  if (reservas.length === 0) {
    document.getElementById("lista").textContent = "Aún no hay reservas.";
    return;
  }
  let html = "<table><tr><th>Cubículo</th><th>Tipo</th><th>Alumnos</th><th>Horas</th></tr>";
  for (let i = 0; i < reservas.length; i++) {
    const r = reservas[i];
    html += "<tr><td>#" + r.numero + "</td><td>" + r.tipo + "</td><td>" + r.alumnos + "</td><td>" + r.horas + "</td></tr>";
  }
  document.getElementById("lista").innerHTML = html + "</table>";
}

document.getElementById("reservar").addEventListener("click", function () {
  const tipo = document.getElementById("tipo").value;
  const numero = parseInt(document.getElementById("numero").value, 10);
  const alumnos = parseInt(document.getElementById("alumnos").value, 10);
  const horas = parseInt(document.getElementById("horas").value, 10);
  const cont = document.getElementById("salida");

  if ([numero, alumnos, horas].some(isNaN)) {
    cont.innerHTML = "<span class='mal'>Completa todos los campos.</span>";
    return;
  }

  const r = evaluarReserva(tipo, alumnos, horas);
  cont.innerHTML = "<b class='" + (r.aprobada ? "ok" : "mal") + "'>" + escaparHtml(r.mensaje) + "</b>";
  if (r.aprobada) {
    reservas.push({ numero: numero, tipo: tipo, alumnos: alumnos, horas: horas });
    dibujarReservas();
  }
});

// ----- Pruebas -----
document.getElementById("probar").addEventListener("click", function () {
  const casos = [];
  const texto = function (r) { return r.aprobada ? "Aprobada" : "Rechazada"; };

  // Caja negra: fronteras cubículo grande (mín. 5)
  const grande = [[4, "Rechazada"], [5, "Aprobada"], [6, "Aprobada"]];
  for (let i = 0; i < grande.length; i++) {
    casos.push({ nombre: "Grande con " + grande[i][0] + " alumnos", esperado: grande[i][1], obtenido: texto(evaluarReserva("grande", grande[i][0], 1)) });
  }

  // Caja negra: fronteras cubículo pequeño (mín. 2)
  const pequeno = [[1, "Rechazada"], [2, "Aprobada"], [3, "Aprobada"]];
  for (let i = 0; i < pequeno.length; i++) {
    casos.push({ nombre: "Pequeño con " + pequeno[i][0] + " alumnos", esperado: pequeno[i][1], obtenido: texto(evaluarReserva("pequeño", pequeno[i][0], 1)) });
  }

  // Fronteras de horas
  casos.push({ nombre: "2 horas (máximo permitido)", esperado: "Aprobada", obtenido: texto(evaluarReserva("pequeño", 2, 2)) });
  casos.push({ nombre: "3 horas (excede el máximo)", esperado: "Rechazada", obtenido: texto(evaluarReserva("pequeño", 2, 3)) });

  // Caja blanca: cada rama de las condiciones compuestas
  casos.push({ nombre: "Rama: pequeño y alumnos < 2", esperado: "Rechazada", obtenido: texto(evaluarReserva("pequeño", 1, 1)) });
  casos.push({ nombre: "Rama: grande y alumnos < 5", esperado: "Rechazada", obtenido: texto(evaluarReserva("grande", 3, 1)) });
  casos.push({ nombre: "Rama: tipo no válido", esperado: "Rechazada", obtenido: texto(evaluarReserva("mediano", 10, 1)) });
  casos.push({ nombre: "Rama: reserva válida", esperado: "Aprobada", obtenido: texto(evaluarReserva("grande", 8, 2)) });

  mostrarPruebas(casos, "pruebas");
});
