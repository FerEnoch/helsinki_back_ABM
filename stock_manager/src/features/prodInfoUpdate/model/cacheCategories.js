import { overwriteCacheSheetData } from '../../../entities/cache';
import { SPREADSHEET } from '../../../entities/sheetData/config/spreadsheet';

export async function cacheCategories(toCache) {
  const { CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE } = SPREADSHEET;

  Logger.log(`Adding products by categories to cache sheet`);
  await overwriteCacheSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE, toCache);
}
