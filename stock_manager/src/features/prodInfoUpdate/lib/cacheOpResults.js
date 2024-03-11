// import { setInCache } from '../../../entities/cache/setInCache';
// import { SPREADSHEET } from '../../../entities/sheetData/config/spreadsheet';
// import { fetchSheetData } from '../../../entities/sheetData/lib/fetchSheetData';
// import { DATABASE_OPERATIONS } from '../../../shared/api/config/database-operations';
// import { checkExecutionTime } from '../config.js/checkExecutionTime';

// export async function cacheOpResults(categoriesInfoToCache, flag) {
//   const { CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE } = SPREADSHEET;
//   const { DELETE } = DATABASE_OPERATIONS;
//   const { rawData: cacheProdCategories } = await fetchSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE);

//   categoriesInfoToCache.forEach((categoryToCache) => {
//     if (checkExecutionTime()) throw new Error('retry', { cause: 408 });
//     let rowToOverwrite = null;

//     cacheProdCategories.forEach(([cacheCategory], rowIndex) => {
//       if (rowIndex === 0) return; // Esc. headers row
//       const categoryExistsInCache = categoryToCache.category === cacheCategory;
//       if (categoryExistsInCache) rowToOverwrite = rowIndex + 1;
//     });

//     const infoToCacheArray = Object.values({ ...categoryToCache });
//     setInCache({
//       spreadsheetID: CACHE_SPREADSHEET_ID,
//       sheetName: PRODUCTS_CATEGORIES_CACHE,
//       value: flag === DELETE ? null : infoToCacheArray,
//       range: {
//         row: rowToOverwrite,
//         col: infoToCacheArray.length, // Sólo sobreescribe la columna data, que es la última
//       },
//     });
//   });
//   SpreadsheetApp.flush();
// }
