import { SPREADSHEET_CONFIG } from '.';

export const SPREADSHEET = {
  STOCK: SPREADSHEET_CONFIG.STOCK,
  COMBOS: SPREADSHEET_CONFIG.COMBOS,
  INFO: SPREADSHEET_CONFIG.INFO,
  FAQ: SPREADSHEET_CONFIG.FAQ,
  ACCOUNT: SPREADSHEET_CONFIG.ACCOUNT,
  STOCK_SPREADSHEET_ID: SPREADSHEET_CONFIG.STOCK_SPREADSHEET_ID,
  PRODUCTS_CATEGORIES_CACHE: SPREADSHEET_CONFIG.PRODUCTS_CATEGORIES_CACHE,
  INFO_CACHE: SPREADSHEET_CONFIG.INFO_CACHE,
  CACHE_SPREADSHEET_ID: SPREADSHEET_CONFIG.CACHE_SPREADSHEET_ID,
};

export const COLUMN_HEADERS = {
  PRODUCTS: {
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
  },
  COMBOS: {
    name: /nombre/i,
    featInfo: /info/i,
    products: /productos/i,
    price: /precio/i,
    image: /imagen/i,
  },
  MAIN_SHEET_INFO: {
    about: /quienes somos/i,
    tel: /tel[eé]fono/i,
    mail: /mail/i,
    attention: /atenci[oó]n/i,
    other_info: /extra/i,
    facebook: /facebook/i,
    instagram: /instagram/i,
    tik_tok: /tiktok/i,
    zones: /delivery/i,
  },
  MAIN_SHEET_ACCOUNT: {
    payment_method: /medio/i,
    cbu_or_link: /cbu|link/i,
    service: /servicio/i,
    alias: /alias/i,
    cuil: /cuil/i,
  },
};

export const INITIAL_URL_FRAGMENTS = ['https://drive.google.com/uc?id=', 'https://drive.google.com/uc?export=view&id='];
