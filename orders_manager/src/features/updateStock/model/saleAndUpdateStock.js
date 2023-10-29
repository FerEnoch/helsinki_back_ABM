import { alertUI } from '../../../shared/lib/alertUI';
import { ORDERS_SHEET_ID, ORDERS_SHEET_NAME, errorCellBackgroundColor, successCellBackgorundColor } from '../config';
import {
  PAYMENT_STATE_PENDING_TEXT,
  NOT_UPDATE_SCRIPT_MESSAGE,
  PAYMENT_STATE_CHECK_TEXT,
  OBSERVATIONS_HEADER_ARRAY_COL_NUMBER,
} from '../lib';
import { setBackgoundOnActiveSpreadsheetRow } from '../lib/setBackgoundOnActiveSpreadsheetRow';
import { setSheetValue } from '../lib/setSheetValue';
import { getConfirmedOrder } from './getIncommingOrder';
import { hasEditedPaymentStateColumn } from './hasEditedPaymentStateColumn';
import { contrastWithCurrentStock } from './contrastWithCurrentStock';
import { verifySalePossibility } from './verifySalePossibility';
import { updateStockSheet } from './updateStockSheet';

export function saleAndUpdateStock(e) {
  const { source, range, oldValue, value } = e;
  const editedColumn = range.getColumn();
  const editedRow = range.getRow();

  const editedContent = value || source.getActiveSheet().getRange(editedRow, editedColumn).getValue();

  if (hasEditedPaymentStateColumn(editedColumn)) {
    Logger.log('Se edito la columna de estado del pago - controlando si es necesario actualizar stock');

    const isStatePending = editedContent.match(PAYMENT_STATE_PENDING_TEXT);
    if (isStatePending) {
      Logger.log(NOT_UPDATE_SCRIPT_MESSAGE(editedRow, editedColumn, editedContent));
      return;
    }
    if (oldValue?.match(PAYMENT_STATE_CHECK_TEXT)) {
      Logger.log(`Stock ya estaba actualizado anteriormente con el pedido de la fila ${editedRow}`);
      return;
    }

    Logger.log('Realizando la venta y actualizando los datos...');
    getConfirmedOrder(editedRow)
      .then(contrastWithCurrentStock)
      .then(verifySalePossibility)
      .then(async ({ id, row, cart, isGlobalSalePossible }) => {
        if (!isGlobalSalePossible) {
          const errorMessage = `*** No se puede realizar la venta por FALTA DE STOCK ***\nHay faltante de producto:\n${cart
            .filter(({ salePossibility }) => !salePossibility)
            .map(({ productID }) => productID)
            .join(' - ')}`;
          throw new Error(errorMessage);
        }
        console.log( /* eslint-disable-line */
          `HAY STOCK de todos los productos. Se puede realizar la venta! :) 
          Fila ${row}  ** ID ${id}
          Actualizando planilla de stock...`
        );
        return updateStockSheet({ row, cart });
      })
      .then(({ message, byProductMessage }) => {
        Logger.log(byProductMessage);
        setBackgoundOnActiveSpreadsheetRow(ORDERS_SHEET_NAME, editedRow, successCellBackgorundColor);
        setSheetValue(
          ORDERS_SHEET_ID,
          ORDERS_SHEET_NAME,
          {
            row: editedRow,
            col: OBSERVATIONS_HEADER_ARRAY_COL_NUMBER + 1,
          },
          message
        );
      })
      .catch((error) => {
        console.error( /* eslint-disable-line */
          `Algo ha ocurrido :( ... >_<\n
            ${error.message}
            `
        );
        setBackgoundOnActiveSpreadsheetRow(ORDERS_SHEET_NAME, editedRow, errorCellBackgroundColor);
        setSheetValue(
          ORDERS_SHEET_ID,
          ORDERS_SHEET_NAME,
          {
            row: editedRow,
            col: OBSERVATIONS_HEADER_ARRAY_COL_NUMBER + 1,
          },
          error.message
        ).then(({ operationResult, newValue }) => {
          if (operationResult === 'success') {
            alertUI(newValue);
          }
        });
      });
    return;
  }
  Logger.log(NOT_UPDATE_SCRIPT_MESSAGE(editedRow, editedColumn, editedContent));
}
