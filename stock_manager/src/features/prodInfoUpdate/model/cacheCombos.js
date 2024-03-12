import { overwriteCacheSheetData } from '../../../entities/cache';
import { SPREADSHEET } from '../../../entities/sheetData/config/spreadsheet';

const { CACHE_SPREADSHEET_ID, PRODUCTS_COMBOS_CACHE } = SPREADSHEET;

export async function cacheCombos(toCache) {
  Logger.log(`Adding combos to cache sheet`);
  await overwriteCacheSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_COMBOS_CACHE, toCache);
}
