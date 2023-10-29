export function getActiveSpreadsheetHeaders(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const lastColumn = sheet.getLastColumn();
  const [headers] = sheet.getSheetValues(1, 1, 1, lastColumn);
  return headers;
}
