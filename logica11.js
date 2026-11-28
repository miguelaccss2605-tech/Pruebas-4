// GRUPO 11: lógica del gestor de cobro recurrente (sin interfaz)

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

    resultados.push({
      nombre: u.nombre,
      diasMora: u.diasMora,
      estado: estado,
      recargo: recargo * 100,
      total: u.cuota + u.cuota * recargo
    });
  }
  return resultados;
}

if (typeof module !== "undefined") module.exports = { procesarCobros };
