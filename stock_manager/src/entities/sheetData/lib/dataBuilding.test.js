import { SPREADSHEET } from '../config/spreadsheet';
import { buildedStockData, fetchedStockData } from './test/stock';
import { buildedCombosData, fetchedCombosData } from './test/combos';
import { fetchSheetData } from './fetchSheetData';
import { dataBuilding } from './dataBuilding';

const { STOCK, COMBOS } = SPREADSHEET;

jest.mock('./fetchSheetData', () => ({
  fetchSheetData: jest.fn(),
}));

describe('Data building from fetched raw data', () => {
  test('It should build stock data correctly', async () => {
    // mock raw data fetching
    fetchSheetData.mockImplementation(() => Promise.resolve(fetchedStockData));
    expect(await dataBuilding(STOCK)).toStrictEqual(buildedStockData);
  });

  test('It should build combos data correctly', async () => {
    // mock raw data fetching
    fetchSheetData.mockImplementation(() => Promise.resolve(fetchedCombosData));
    expect(await dataBuilding(COMBOS)).toStrictEqual(buildedCombosData);
  });
});
