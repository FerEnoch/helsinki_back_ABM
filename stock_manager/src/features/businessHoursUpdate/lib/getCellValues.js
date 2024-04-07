import { SPREADSHEET } from '../../../entities/sheetData/config/spreadsheet';

const originSpreadsheet = SpreadsheetApp.openById(SPREADSHEET.STOCK_SPREADSHEET_ID);
const originDataSheet = originSpreadsheet.getSheetByName(SPREADSHEET.BUSINESS_HOURS);

export function getCellValues(range) {
  return range && originDataSheet.getRange(range).getValue();
}
