import { ORDERS_SHEET_NAME } from '../config';
import { getActiveSpreadsheetHeaders } from './getActiveSpreadsheetHeaders';

export function getColumnHeader(column) {
  const headers = getActiveSpreadsheetHeaders(ORDERS_SHEET_NAME);
  return headers[!column ? 0 : column - 1];
}
