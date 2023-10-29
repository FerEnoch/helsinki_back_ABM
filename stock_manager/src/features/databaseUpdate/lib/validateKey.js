import { actionColumnHeaders } from '../../../entities/sheetData/config/spreadsheet';

export function validateKey(validating) {
  if (actionColumnHeaders.image.test(validating)) return 'imageID';
  return Object.keys(actionColumnHeaders).find((key) => actionColumnHeaders[key].test(validating));
}
