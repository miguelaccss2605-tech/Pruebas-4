const test = require("node:test");
const assert = require("node:assert");
const { evaluarReserva } = require("./logica32.js");

test.describe("Grupo 32 - Caja negra: cubículo grande (mín. 5)", () => {
  const casos = [[4, false], [5, true], [6, true]];
  for (const [alumnos, aprobada] of casos) {
    test(`${alumnos} alumnos -> ${aprobada ? "aprobada" : "rechazada"}`, () => {
      assert.strictEqual(evaluarReserva("grande", alumnos, 1).aprobada, aprobada);
    });
  }
});

test.describe("Grupo 32 - Caja negra: cubículo pequeño (mín. 2)", () => {
  const casos = [[1, false], [2, true], [3, true]];
  for (const [alumnos, aprobada] of casos) {
    test(`${alumnos} alumnos -> ${aprobada ? "aprobada" : "rechazada"}`, () => {
      assert.strictEqual(evaluarReserva("pequeño", alumnos, 1).aprobada, aprobada);
    });
  }
});

test.describe("Grupo 32 - Fronteras de horas (máx. 2)", () => {
  test("1 hora -> aprobada", () => {
    assert.strictEqual(evaluarReserva("pequeño", 2, 1).aprobada, true);
  });
  test("2 horas -> aprobada", () => {
    assert.strictEqual(evaluarReserva("pequeño", 2, 2).aprobada, true);
  });
  test("3 horas -> rechazada", () => {
    assert.strictEqual(evaluarReserva("pequeño", 2, 3).aprobada, false);
  });
  test("0 horas -> rechazada", () => {
    assert.strictEqual(evaluarReserva("pequeño", 2, 0).aprobada, false);
  });
});

test.describe("Grupo 32 - Caja blanca: ramas de las condiciones compuestas", () => {
  test("pequeño y alumnos < 2", () => {
    assert.match(evaluarReserva("pequeño", 1, 1).mensaje, /pequeño requiere mínimo 2/);
  });
  test("grande y alumnos < 5", () => {
    assert.match(evaluarReserva("grande", 3, 1).mensaje, /grande requiere mínimo 5/);
  });
  test("tipo no válido", () => {
    assert.match(evaluarReserva("mediano", 10, 1).mensaje, /no válido/);
  });
  test("reserva válida", () => {
    assert.strictEqual(evaluarReserva("grande", 8, 2).mensaje, "Reserva aprobada.");
  });
  test("un cubículo grande con 2 alumnos (válido en pequeño) se rechaza", () => {
    assert.strictEqual(evaluarReserva("grande", 2, 1).aprobada, false);
  });
});
