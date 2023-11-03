/**
 * Fetch raw data from a sheet in a given spreadsheet
 * @param {string} spreadsheetID given spreedsheet ID
 * @param {string} sheetName the sheet name inside that spreadsheet
 * @returns {Promise<{rawData: string[], headerIndexes: number[]}>} { rawData, headerIndexes }
 */
export async function fetchSheetData(spreadsheetID, sheetName, reqColumns) {
  const originSpreadsheet = SpreadsheetApp.openById(spreadsheetID);
  const originDataSheet = originSpreadsheet.getSheetByName(sheetName);
  const headerIndexes = [];
  let rawData = [];

  const lastRow = originDataSheet.getLastRow();
  const lastColumn = originDataSheet.getLastColumn();
  const dataFromSheet = originDataSheet.getSheetValues(1, 1, lastRow || 1, lastColumn || 1);

  if (dataFromSheet.length > 0) {
    rawData = dataFromSheet;
    Object.values(reqColumns).forEach((actionHeader) => {
      const actionHeaderIndex = rawData[0].findIndex((rawHeader) => rawHeader && actionHeader.test(rawHeader));
      if (actionHeaderIndex !== -1) headerIndexes.push(actionHeaderIndex);
    });
  }

  return { rawData, headerIndexes };
}
