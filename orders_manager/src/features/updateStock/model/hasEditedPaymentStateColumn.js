import { ORDERS_SHEET_NAME } from '../config';
import { PAYMENT_STATE_HEADER } from '../lib';
import { getHeadersArrayColumnNum } from '../lib/getHeadersArrayColumnNum';

export function hasEditedPaymentStateColumn(editedColumn) {
  const paymentStateColumn = getHeadersArrayColumnNum(ORDERS_SHEET_NAME, PAYMENT_STATE_HEADER);
  return paymentStateColumn === editedColumn - 1;
}
