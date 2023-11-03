import { COLUMN_HEADERS, SPREADSHEET } from '../../../entities/sheetData/config/spreadsheet';

export function shouldAddImage({ selectedCell, spreadSheet }) {
  const { STOCK, ACCOUNT } = SPREADSHEET;
  const {
    PRODUCTS: { image },
    MAIN_SHEET_ACCOUNT: { cbu_or_link: cbuOrLink },
  } = COLUMN_HEADERS;

  const activeSpreadsheet = spreadSheet || SpreadsheetApp.getActiveSpreadsheet();
  const activeCell = selectedCell || activeSpreadsheet.getActiveCell();

  const activeSheet = activeSpreadsheet.getActiveSheet();
  const activeSheetName = activeSheet.getName();

  const isValidSheet = activeSheetName === STOCK || activeSheetName === ACCOUNT;
  if (!isValidSheet) return false;

  const clickedRow = activeCell.getRow();
  if (clickedRow === 1) return false;

  const clickedColumn = activeCell.getColumn();
  const selectedColumnHeader = activeSheet.getRange(1, clickedColumn).getValue();
  const isValidColumn = [image, cbuOrLink].map((validHeader) => validHeader.test(selectedColumnHeader));
  if (!isValidColumn.includes(true)) return false;

  const firstCellValue = activeSheet.getRange(clickedRow, 1).getValue();
  if (activeSheetName === STOCK) {
    const isValidFirstCell = firstCellValue.toString().includes('#');
    if (!isValidFirstCell) return false;
  }

  /* eslint-disable-next-line */
  return true;
}
