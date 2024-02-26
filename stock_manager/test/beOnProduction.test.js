import { SPREADSHEET } from '../src/entities/sheetData/config/spreadsheet';
import {
  getWebAppApiInfoRoute,
  getWebAppApiProdCatRoute,
  PRODUCTION_URL,
} from '../src/features/databaseUpdate/config/api';
import { DATABASE_FOLDERS } from '../src/shared/api/config/firebase-api';

describe('The app must be on production mode', () => {
  const productionModeConfig = {
    STOCK_SPREADSHEET_ID: '1_U-OJwS_216t6oX_MkC06IetiGtA6TX7Xoptb8ixM64',
    STOCK: 'Stock general',
    COMBOS: 'Combos',
    INFO: 'App-info',
    ACCOUNT: 'App-cuenta',
    FAQ: 'App-Preg. frecuentes',
    CACHE_SPREADSHEET_ID: '16JsIKr-kbOpZSgoQ7q2a4TzfjDTUx4KNa_jP5HZ0txE',
    PRODUCTS_CATEGORIES_CACHE: 'Products-categories',
    PRODUCTS_COMBOS_CACHE: 'Products-combos',
    INFO_CACHE: 'Info',
  };

  const productionDatabase = {
    PRODUCTS_BY_CATEGORIES: 'products-categories',
    PRODUCTS_COMBOS: 'products-combos',
    INFO: 'info',
    PAYMENT_METHODS: 'paymentMethods',
    FAQ: 'faq',
    IMAGES: 'images',
  };

  const apiProdsRoute = getWebAppApiProdCatRoute('compose');
  const apiInfoRoute = getWebAppApiInfoRoute();

  test('It should work on production-mode', () => {
    expect(process.env.NODE_ENV === 'production').toBe(true);
  });

  test('They must be production sheets', () => {
    expect(SPREADSHEET).toStrictEqual(productionModeConfig);
  });

  test('They must be production firebase folders', () => {
    expect(DATABASE_FOLDERS).toStrictEqual(productionDatabase);
  });

  test('Web app api routes must be on production routes', () => {
    expect(apiProdsRoute).toBe(`${PRODUCTION_URL}/api/products/compose`);
    expect(apiInfoRoute).toBe(`${PRODUCTION_URL}/api/`);
  });
});
