const test = require("node:test");
const assert = require("node:assert");
const { evaluarCredito } = require("./logica8.js");

test.describe("Grupo 8 - Caja blanca: cortocircuito", () => {
  test("historial Malo sale rápido, aunque la edad también sea inválida", () => {
    const r = evaluarCredito(5000, 18, "Malo", 1000, 100);
    assert.strictEqual(r.decision, "Rechazado");
    assert.strictEqual(r.ruta, "cortocircuito-historial");
  });

  test("historial Malo rechaza aunque todo lo demás sea perfecto", () => {
    assert.strictEqual(evaluarCredito(9999, 30, "Malo", 100, 100).decision, "Rechazado");
  });

  test("historial Bueno y Excelente sí siguen evaluando", () => {
    assert.strictEqual(evaluarCredito(3000, 30, "Bueno", 1200, 12).ruta, "aprobado");
    assert.strictEqual(evaluarCredito(3000, 30, "Excelente", 1200, 12).ruta, "aprobado");
  });

  test("edad inválida sale por la ruta 'edad'", () => {
    assert.strictEqual(evaluarCredito(3000, 20, "Bueno", 1000, 12).ruta, "edad");
  });

  test("sueldo bajo y cuota alta salen por 'capacidad-pago'", () => {
    assert.strictEqual(evaluarCredito(1500, 30, "Bueno", 1000, 12).ruta, "capacidad-pago");
  });
});

test.describe("Grupo 8 - Caja negra: fronteras de edad", () => {
  const edades = [[20, "Rechazado"], [21, "Aprobado"], [65, "Aprobado"], [66, "Rechazado"]];
  for (const [edad, esperado] of edades) {
    test(`edad ${edad} -> ${esperado}`, () => {
      assert.strictEqual(evaluarCredito(3000, edad, "Bueno", 1000, 12).decision, esperado);
    });
  }
});

test.describe("Grupo 8 - Caja negra: fronteras de capacidad de pago", () => {
  const sueldo = 2000;
  const plazo = 12;
  const casos = [[0.299, "Aprobado"], [0.300, "Aprobado"], [0.301, "Rechazado"]];
  for (const [porcentaje, esperado] of casos) {
    test(`cuota = ${(porcentaje * 100).toFixed(1)}% del sueldo -> ${esperado}`, () => {
      const monto = sueldo * porcentaje * plazo;
      assert.strictEqual(evaluarCredito(sueldo, 30, "Excelente", monto, plazo).decision, esperado);
    });
  }
});

test.describe("Grupo 8 - Frontera del sueldo mínimo", () => {
  test("sueldo $1999 -> Rechazado", () => {
    assert.strictEqual(evaluarCredito(1999, 30, "Bueno", 100, 12).decision, "Rechazado");
  });
  test("sueldo $2000 -> Aprobado", () => {
    assert.strictEqual(evaluarCredito(2000, 30, "Bueno", 100, 12).decision, "Aprobado");
  });
});
