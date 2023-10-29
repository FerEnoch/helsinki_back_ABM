import { actionColumnHeaders, SPREADSHEET } from '../../../entities/sheetData/config/spreadsheet';

export function shouldAddImage({ selectedCell, spreadSheet }) {
  const activeSpreadsheet = spreadSheet || SpreadsheetApp.getActiveSpreadsheet();
  const activeCell = selectedCell || activeSpreadsheet.getActiveCell();

  const activeSheet = activeSpreadsheet.getActiveSheet();
  const activeSheetName = activeSheet.getName();
  if (activeSheetName !== SPREADSHEET.STOCK) return false;

  const clickedRow = activeCell.getRow();
  if (clickedRow === 1) return false;

  const clickedColumn = activeCell.getColumn();
  const selectedColumnHeader = activeSheet.getRange(1, clickedColumn).getValue();
  const imageHeader = actionColumnHeaders.image;
  if (!imageHeader.test(selectedColumnHeader)) return false;

  const firstCellValue = activeSheet.getRange(clickedRow, 1).getValue();
  const isValidFirstCell = firstCellValue.toString().includes('#');
  if (!isValidFirstCell) return false;

  /* eslint-disable-next-line */
  return true;
}
