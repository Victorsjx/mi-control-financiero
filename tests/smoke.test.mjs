import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
const dice = await readFile(new URL("../dice.js", import.meta.url), "utf8");
const worker = await readFile(new URL("../cloudflare/worker.js", import.meta.url), "utf8");
const sw = await readFile(new URL("../sw.js", import.meta.url), "utf8");

test("la clave local histórica se mantiene intacta", () => {
  assert.match(app, /const STORAGE_KEY\s*=\s*"mi-control-financiero-v1"/);
});

test("los importes de respaldo se validan antes de reemplazar datos", () => {
  assert.match(app, /data\.transactions\.every\(validTransaction\)/);
  assert.match(app, /f\.size>10\*1024\*1024/);
  assert.match(app, /data\.transactions\.length>50000/);
  assert.match(app, /Identificadores de movimientos duplicados/);
  assert.match(app, /¿Continuar\?/);
});

test("el historial limita los elementos renderizados por página", () => {
  assert.match(app, /HISTORY_PAGE_SIZE=100/);
  assert.match(app, /a\.slice\(historyPage\*HISTORY_PAGE_SIZE/);
  assert.match(app, /historyNext/);
});

test("el índice mensual se invalida al guardar", () => {
  assert.match(app, /monthTransactionIndex=new Map\(\)/);
  assert.match(app, /monthTransactionIndex=null/);
});

test("el Worker aplica límites si se configura el binding y timeouts externos", () => {
  assert.match(worker, /RECEIPT_RATE_LIMITER\.limit/);
  assert.match(worker, /AbortSignal\.timeout/);
  assert.match(worker, /MAX_FILE_SIZE/);
});

test("la caché PWA referencia los recursos versionados actuales", () => {
  assert.match(sw, /mi-finanzas-v40/);
  assert.ok(sw.includes("./styles.css?v=39"));
  assert.ok(sw.includes("./app.js?v=39"));
  assert.ok(sw.includes("./dice.js?v=39"));
});

test("Finance Dice usa aleatoriedad criptográfica y respeta el porcentaje configurado", () => {
  assert.match(dice, /crypto\.getRandomValues/);
  assert.match(dice, /chance\*10000/);
  assert.match(dice, /draw<chance\*10000/);
  assert.match(dice, /1000000/);
  assert.match(dice, /addEventListener\("input",updateChance/);
});

test("Finance Dice es independiente y no altera movimientos ni presupuesto", () => {
  assert.match(dice, /diceRollButton/);
  assert.match(dice, /showDiceScreen/);
  assert.doesNotMatch(dice, /saveState|STORAGE_KEY|transactions\.push/);
  assert.doesNotMatch(app, /Finance Dice v2/);
});
