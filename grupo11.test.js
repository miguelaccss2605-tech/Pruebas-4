const test = require("node:test");
const assert = require("node:assert");
const { procesarCobros } = require("./logica11.js");

const usuario = (dias, cuota = 100) => ({ nombre: "T", cuota: cuota, diasMora: dias });

test.describe("Grupo 11 - Caja blanca: ciclo 'for'", () => {
  test("lista vacía: 0 iteraciones", () => {
    assert.strictEqual(procesarCobros([]).length, 0);
  });

  test("1 usuario: 1 iteración", () => {
    const r = procesarCobros([usuario(0)]);
    assert.strictEqual(r.length, 1);
    assert.strictEqual(r[0].estado, "Activo");
  });

  test("múltiples usuarios: procesa a todos, en orden", () => {
    const r = procesarCobros([
      { nombre: "A", cuota: 10, diasMora: 0 },
      { nombre: "B", cuota: 10, diasMora: 5 },
      { nombre: "C", cuota: 10, diasMora: 20 },
      { nombre: "D", cuota: 10, diasMora: 40 }
    ]);
    assert.deepStrictEqual(r.map(x => x.nombre), ["A", "B", "C", "D"]);
    assert.deepStrictEqual(r.map(x => x.estado), [
      "Activo", "Aviso de Cobro", "Suspendido", "Cancelado / Cobranza judicial"
    ]);
  });
});

test.describe("Grupo 11 - Caja negra: fronteras de días de mora", () => {
  const fronteras = [
    [0, "Activo"],
    [1, "Aviso de Cobro"],
    [15, "Aviso de Cobro"],
    [16, "Suspendido"],
    [30, "Suspendido"],
    [31, "Cancelado / Cobranza judicial"]
  ];
  for (const [dias, esperado] of fronteras) {
    test(`${dias} días de mora -> ${esperado}`, () => {
      assert.strictEqual(procesarCobros([usuario(dias)])[0].estado, esperado);
    });
  }
});

test.describe("Grupo 11 - Recargos", () => {
  test("sin recargo para Activo", () => {
    assert.strictEqual(procesarCobros([usuario(0)])[0].total, 100);
  });
  test("5% de recargo con mora 1", () => {
    assert.strictEqual(procesarCobros([usuario(1)])[0].total, 105);
  });
  test("10% de recargo con mora 16", () => {
    assert.strictEqual(procesarCobros([usuario(16)])[0].total, 110);
  });
  test("sin recargo para Cancelado", () => {
    assert.strictEqual(procesarCobros([usuario(31)])[0].total, 100);
  });
});
