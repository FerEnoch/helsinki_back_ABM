import { buildedCombosData, testCombosMapBuilding } from '../../../entities/sheetData/lib/test/combos';
import { buildedStockData, testStockMapBuilding } from '../../../entities/sheetData/lib/test/stock';
import { getProdsByCategories } from './getProdsByCategories';

describe('Data maps building', () => {
  test('It should build map with stock data', async () => {
    const result = {};
    (await getProdsByCategories(buildedStockData)).forEach((values, key) => {
      result[key] = values;
    });
    expect(result).toStrictEqual(testStockMapBuilding);
  });

  test('It should build map with combos data', async () => {
    const result = {};
    (await getProdsByCategories(buildedCombosData)).forEach((values, key) => {
      result[key] = values;
    });
    expect(result).toStrictEqual(testCombosMapBuilding);
  });
});
