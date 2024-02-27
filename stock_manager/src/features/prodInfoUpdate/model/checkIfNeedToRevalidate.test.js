import { checkIfNeedToRevalidate } from './checkIfNeedToRevalidate';
import { buildedCombosData, testCombosCache } from './test/combos';
import { buildedStockData, testStockCache } from './test/stock';

/* STOCK DATA */
let buildedStock;
let cacheStock;

/* COMBOS DATA */
let buildedCombos;
let cacheCombos;

beforeEach(() => {
  buildedStock = structuredClone(buildedStockData);
  cacheStock = structuredClone(testStockCache);
  buildedCombos = structuredClone(buildedCombosData);
  cacheCombos = structuredClone(testCombosCache);
});

/* STOCK TESTING */
describe('Compare STOCK in order to update database', () => {
  test("It should detect when there's NO changes", async () => {
    expect(await checkIfNeedToRevalidate(buildedStock, cacheStock)).toBe(false);
  });

  test('It should detect CREATE from scratch (no-cache data)', async () => {
    cacheStock = [];

    expect(await checkIfNeedToRevalidate(buildedStock, cacheStock)).toBe(true);
  });

  test('It should detect CREATE 1 item', async () => {
    buildedStock[1].id = '#123';

    expect(await checkIfNeedToRevalidate(buildedStock, cacheStock)).toBe(true);
  });

  test('It should detect DELETE all items (no builded data)', async () => {
    buildedStock = [];

    expect(await checkIfNeedToRevalidate(buildedStock, cacheStock)).toBe(true);
  });

  test('It should detect DELETE 1 item from database', async () => {
    buildedStock[5].id = null;

    expect(await checkIfNeedToRevalidate(buildedStock, cacheStock)).toBe(true);
  });

  test('It should detect diff. variations to UPDATE database', async () => {
    buildedStock[0].type = 'new-type';
    buildedStock[1] = { id: '#002' };

    expect(await checkIfNeedToRevalidate(buildedStock, cacheStock)).toBe(true);
  });
});

/* COMBOS TESTING */
describe('Compare COMBOS in order to update database', () => {
  test("It should detect when there's NO changes", async () => {
    expect(await checkIfNeedToRevalidate(buildedCombos, cacheCombos)).toBe(false);
  });

  test('It should detect CREATE from scratch (no-cache data)', async () => {
    cacheCombos = [];
    expect(await checkIfNeedToRevalidate(buildedCombos, cacheCombos)).toBe(true);
  });

  test('It should detect CREATE 1 item', async () => {
    buildedCombos[1].id = '#123';

    expect(await checkIfNeedToRevalidate(buildedCombos, cacheCombos)).toBe(true);
  });

  test('It should detect DELETE all items (no builded data)', async () => {
    buildedCombos = [];

    expect(await checkIfNeedToRevalidate(buildedCombos, cacheCombos)).toBe(true);
  });

  test('It should detect DELETE 1 item from database', async () => {
    buildedCombos[0].id = null;

    expect(await checkIfNeedToRevalidate(buildedCombos, cacheCombos)).toBe(true);
  });

  test('It should detect diff. variations to UPDATE database', async () => {
    buildedCombos[0].type = 'new-type';

    expect(await checkIfNeedToRevalidate(buildedCombos, cacheCombos)).toBe(true);
  });
});
