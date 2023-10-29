export async function getAllSheetValues(spreadsheetId, sheetName) {
  const stockSheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  const allDataRange = stockSheet.getDataRange();
  return allDataRange.getValues();
}
