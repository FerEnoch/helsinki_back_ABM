import { SPREADSHEET } from '../sheetData/config/spreadsheet';
import { fetchSheetData } from '../sheetData/lib/fetchSheetData';
import { toCacheSheetDataBuilding } from '../sheetData/lib/toCacheSheetDataBuilding';

/**
 * Gets current cache sheet data
 * @return {Promise<Product[]>} Array of products that are cached
 */
export async function getCacheSheetData() {
  const { rawData: cachedDataArrays } = await fetchSheetData(SPREADSHEET.CACHE_SPREADSHEET_ID, SPREADSHEET.CACHE);
  if (!cachedDataArrays.length) return [];
  const cacheProducts = [];
  const headers = [];
  cachedDataArrays.forEach((productDataRow, rowIndex) => {
    if (!productDataRow || !productDataRow.length) return;
    const product = {};
    /* First row of the cache sheet is the headers row */
    if (rowIndex === 0) {
      productDataRow.forEach((header) => {
        headers.push(header);
      });
      return;
    }
    productDataRow.forEach((productDataField, dataIndex) => {
      product[headers[dataIndex]] = productDataField;
    });
    cacheProducts.push(product);
  });
  return cacheProducts;
}

/**
 *  Writes data in cache sheet
 * @param {Array} rawData Products array: [ { [name.slice(69)]: { firestoreName: name, ...file } } ]
 * @return {void}
 */
export async function overwriteCacheSheetData(rawData) {
  console.log(`CACHING ${rawData.length} PRODUCTS`);  /* eslint-disable-line */
  const cacheSpreadsheet = SpreadsheetApp.openById(SPREADSHEET.CACHE_SPREADSHEET_ID);
  const cacheSheet = cacheSpreadsheet.getSheetByName(SPREADSHEET.CACHE);

  const toCacheSheetData = await toCacheSheetDataBuilding([...rawData]);
  if (!toCacheSheetData.length) throw new Error('Unable to build data to copy to cache sheet');

  if (toCacheSheetData.length > 0) {
    cacheSheet.clearContents();
    toCacheSheetData.forEach((row) => {
      if (row.length > 0) cacheSheet.appendRow(row);
    });
  }
}
