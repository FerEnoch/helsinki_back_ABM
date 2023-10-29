import { getActiveSpreadsheetHeaders } from './getActiveSpreadsheetHeaders';

export function getHeadersArrayColumnNum(sheetName, reqHeader) {
  const headers = getActiveSpreadsheetHeaders(sheetName);

  const [paymentStateHeaderIndex] = headers
    .map((header, index) => {
      if (header.match(reqHeader)) return String(index);
      return null;
    })
    .filter(Boolean);

  return Number(paymentStateHeaderIndex) || undefined;
}
