import { setInCache } from '../../../entities/cache/setInCache';
import { SPREADSHEET } from '../../../entities/sheetData/config/spreadsheet';
import { fetchSheetData } from '../../../entities/sheetData/lib/fetchSheetData';
import { DATABASE_OPERATIONS } from '../../../shared/api/config/database-operations';

export async function cacheOpResults(categoriesInfoToCache, flag) {
  const { CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE } = SPREADSHEET;
  const { DELETE } = DATABASE_OPERATIONS;
  const { rawData: cacheProdCategories } = await fetchSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE);

  categoriesInfoToCache.forEach((categoryToCache) => {
    let rowToOverwrite = null;
    cacheProdCategories.forEach(([cacheCategory], rowIndex) => {
      if (rowIndex === 0) return; // Esc. headers row
      const categoryExistsInCache = categoryToCache.category === cacheCategory;
      if (categoryExistsInCache) rowToOverwrite = rowIndex + 1;
    });
    setInCache({
      spreadsheetID: CACHE_SPREADSHEET_ID,
      sheetName: PRODUCTS_CATEGORIES_CACHE,
      value: flag === DELETE ? null : Object.values({ ...categoryToCache }),
      row: rowToOverwrite,
    });
  });
}
