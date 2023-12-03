export function setInCache({ spreadsheetID, sheetName, range, value }) {
  const { row, col } = range;
  Logger.log(
    `Modifing cache sheet: ${row ? `row: ${row}` : 'appending row'} <-> ${
      value ? `category: ${value[0]}` : 'delete row'
    }`
  );

  if (!row && !value) {
    Logger.error(`Provide a row or value to caching process`);
    return;
  }

  const sheet = SpreadsheetApp.openById(spreadsheetID).getSheetByName(sheetName);

  if (!value) {
    sheet.deleteRow(row);
    return;
  }
  if (!row) {
    sheet.appendRow(value);
    return;
  }
  const valueRow = sheet.getRange(row, col);
  valueRow.setValue(value[value.length - 1]);
}
