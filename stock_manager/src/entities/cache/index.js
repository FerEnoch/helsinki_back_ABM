import { fetchSheetData } from '../sheetData/lib/fetchSheetData';
import { toCacheSheetDataBuilding } from '../sheetData/lib/toCacheSheetDataBuilding';

/**
 * Gets current cache sheet data
 * @return {Promise<Value[]>} Array of values (objects) that are in the given cache sheet
 */
export async function getCacheSheetData(...args) {
  const { rawData: cachedDataArrays } = await fetchSheetData(...args);
  if (!cachedDataArrays?.length) return [];
  const cacheValues = [];
  const headers = [];
  cachedDataArrays.forEach((valueDataRow, rowIndex) => {
    if (!valueDataRow || !valueDataRow.length) return;
    const value = {};
    /* First row of the cache sheet is the headers row */
    if (rowIndex === 0) {
      valueDataRow.forEach((header) => {
        headers.push(header);
      });
      return;
    }
    valueDataRow.forEach((entry, entryIndex) => {
      value[headers[entryIndex]] = entry;
    });
    cacheValues.push(value);
  });
  return cacheValues;
}

/**
 *  Writes data in cache sheet
 *  @param {string} sheetID
 *  @param {string} sheetName
 * @param {Array} rawData Products array: [ { [name.slice(69)]: { firestoreName: name, ...file } } ]
 * @return {void}
 */
export async function overwriteCacheSheetData(sheetID, sheetName, rawData) {
  console.log(`CACHING ${rawData.length} items`);  /* eslint-disable-line */
  const cacheSpreadsheet = SpreadsheetApp.openById(sheetID);
  const cacheSheet = cacheSpreadsheet.getSheetByName(sheetName);

  const toCacheSheetData = await toCacheSheetDataBuilding([...rawData]);
  if (!toCacheSheetData.length) throw new Error(`Unable to build data to copy to ${sheetName} sheet`);

  if (toCacheSheetData.length > 0) {
    cacheSheet.clearContents();
    toCacheSheetData.forEach((row) => {
      if (row.length > 0) cacheSheet.appendRow(row);
    });
  }
}
