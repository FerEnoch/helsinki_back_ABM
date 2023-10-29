export async function setSheetValue(spreadsheetId, sheetName, { row, col }, value) {
  let operationResult = 'failure';
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  const cell = sheet.getRange(row, col);
  const newValue = cell.setValue(value).getValue();

  if (newValue === value) operationResult = 'success';

  return { operationResult, newValue };
}
