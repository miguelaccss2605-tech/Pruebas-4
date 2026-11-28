const test = require("node:test");
const assert = require("node:assert");
const { inventarioInicial, procesarVenta } = require("./logica31.js");

const nuevaDB = (stock, requiereReceta) => ({ Med: { stock: stock, requiereReceta: requiereReceta } });

test.describe("Grupo 31 - Caja blanca: ramas condicionales", () => {
  test("rama 1: requiere receta y no la presenta -> Rechazada", () => {
    assert.strictEqual(procesarVenta(nuevaDB(10, true), "Med", 1, true, false).estado, "Rechazada");
  });

  test("rama 2: stock < cantidad -> Parcial", () => {
    assert.strictEqual(procesarVenta(nuevaDB(3, false), "Med", 5, false, false).estado, "Parcial");
  });

  test("rama 3: venta aprobada -> Completa", () => {
    assert.strictEqual(procesarVenta(nuevaDB(10, false), "Med", 2, false, false).estado, "Completa");
  });

  test("requiere receta y la presenta -> Completa", () => {
    assert.strictEqual(procesarVenta(nuevaDB(10, true), "Med", 2, true, true).estado, "Completa");
  });

  test("medicamento inexistente -> Error", () => {
    assert.strictEqual(procesarVenta(nuevaDB(10, false), "Otro", 1, false, false).estado, "Error");
  });

  test("la receta se revisa antes que el stock", () => {
    assert.strictEqual(procesarVenta(nuevaDB(0, true), "Med", 5, true, false).estado, "Rechazada");
  });
});

test.describe("Grupo 31 - Caja negra: fronteras de stock", () => {
  const stockActual = 10;
  const pedidos = [
    [stockActual - 1, "Completa"],
    [stockActual, "Completa"],
    [stockActual + 1, "Parcial"]
  ];
  for (const [cantidad, esperado] of pedidos) {
    test(`pedir ${cantidad} con stock ${stockActual} -> ${esperado}`, () => {
      assert.strictEqual(procesarVenta(nuevaDB(stockActual, false), "Med", cantidad, false, false).estado, esperado);
    });
  }
});

test.describe("Grupo 31 - Actualización del stock", () => {
  test("venta completa descuenta el stock", () => {
    const db = nuevaDB(10, false);
    procesarVenta(db, "Med", 4, false, false);
    assert.strictEqual(db.Med.stock, 6);
  });

  test("vender todo deja el stock en 0", () => {
    const db = nuevaDB(10, false);
    procesarVenta(db, "Med", 10, false, false);
    assert.strictEqual(db.Med.stock, 0);
  });

  test("venta parcial no cambia el stock", () => {
    const db = nuevaDB(10, false);
    procesarVenta(db, "Med", 11, false, false);
    assert.strictEqual(db.Med.stock, 10);
  });

  test("venta rechazada no cambia el stock", () => {
    const db = nuevaDB(10, true);
    procesarVenta(db, "Med", 1, true, false);
    assert.strictEqual(db.Med.stock, 10);
  });

  test("inventarioInicial devuelve una copia nueva cada vez", () => {
    const a = inventarioInicial();
    a["Paracetamol 500mg"].stock = 0;
    assert.strictEqual(inventarioInicial()["Paracetamol 500mg"].stock, 50);
  });
});
