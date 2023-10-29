import { SPREADSHEET_CONFIG } from '.';

export const SPREADSHEET = {
  STOCK: SPREADSHEET_CONFIG.STOCK,
  STOCK_SPREADSHEET_ID: SPREADSHEET_CONFIG.STOCK_SPREADSHEET_ID,
  CACHE: SPREADSHEET_CONFIG.CACHE,
  CACHE_SPREADSHEET_ID: SPREADSHEET_CONFIG.CACHE_SPREADSHEET_ID,
};

export const actionColumnHeaders = {
  id: /id/i,
  category: /categor[íi]a/i,
  type: /tipo/i,
  name: /nombre/i,
  description: /descripci[oó]n/i,
  image: /imagen/i,
  destillery: /destiler[ií]a/i,
  alcohol: /alcohol/i,
  stock: /stock/i,
  price: /p[uú]blico/i,
};
