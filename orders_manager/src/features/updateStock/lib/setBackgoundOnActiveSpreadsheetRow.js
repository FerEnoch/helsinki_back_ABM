export function setBackgoundOnActiveSpreadsheetRow(sheetName, row, color) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const lastColumn = sheet.getLastColumn();
  const range = sheet.getRange(row, 1, 1, lastColumn);
  range.setBackground(color);
}
