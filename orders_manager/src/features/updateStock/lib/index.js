import { ORDERS_SHEET_NAME } from '../config';
import { getHeadersArrayColumnNum } from './getHeadersArrayColumnNum';
import { notUpdateScriptMessage } from './notUpdateScriptMessage';

export const PAYMENT_STATE_PENDING_TEXT = /pendiente/i;
export const PAYMENT_STATE_CHECK_TEXT = /check/i;
export const PAYMENT_STATE_HEADER = /estado/i;

const UPDATE_STOCK_HEADER = /(actualizaci[oó]n\sde\sstock)|(stock)/i;
export const UPDATE_STOCK_ARRAY_COL_NUMBER = getHeadersArrayColumnNum(ORDERS_SHEET_NAME, UPDATE_STOCK_HEADER);

const ORDER_ID_HEADER = /\bid\b/i;
export const ORDER_ID_ARRAY_COL_NUMBER = getHeadersArrayColumnNum(ORDERS_SHEET_NAME, ORDER_ID_HEADER);

const OBSERVATIONS_HEADER = /observaciones/i;
export const OBSERVATIONS_HEADER_ARRAY_COL_NUMBER = getHeadersArrayColumnNum(ORDERS_SHEET_NAME, OBSERVATIONS_HEADER);

export const NOT_UPDATE_SCRIPT_MESSAGE = notUpdateScriptMessage;
