// GRUPO 32: interfaz (la lógica está en logica32.js)

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
