import { ORDERS_SHEET_NAME } from '../config';
import { ORDER_ID_ARRAY_COL_NUMBER, UPDATE_STOCK_ARRAY_COL_NUMBER } from '../lib';
import { isOrderValid } from '../lib/isOrderValid';

export async function getConfirmedOrder(orderRow) {
  const ordersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ORDERS_SHEET_NAME);
  const lastColumn = ordersSheet.getLastColumn();
  const dataReceivedLastColumn = lastColumn - 1; // without 'Observaciones' column
  const [incommingOrderAllDataRow] = ordersSheet.getSheetValues(orderRow, 1, 1, dataReceivedLastColumn);

  if (!isOrderValid(incommingOrderAllDataRow)) {
    throw new Error(`No parece haber un pedido válido en la fila ${orderRow}`);
  }

  return {
    id: incommingOrderAllDataRow[ORDER_ID_ARRAY_COL_NUMBER],
    row: orderRow,
    cart: incommingOrderAllDataRow[UPDATE_STOCK_ARRAY_COL_NUMBER].split('//').map((order) => [...order.split('-')]),
  };
}
