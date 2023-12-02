export function setInCache({ spreadsheetID, sheetName, value, row }) {
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
  // Sólo sobreescribe la columna data, que es la última
  const valueRow = sheet.getRange(row, value.length);
  valueRow.setValue(value[value.length - 1]);
}
