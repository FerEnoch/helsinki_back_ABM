import { getCacheSheetData } from '../../../entities/cache';
import { SPREADSHEET } from '../../../entities/sheetData/config/spreadsheet';
import { stockDataBuilding } from '../../../entities/sheetData/lib/stockDataBuilding';
import { DATABASE_API_ACTIONS } from '../../../shared/api';
import { DATABASE_OPERATIONS } from '../../../shared/api/config/database-operations';
import { DATABASE_FOLDERS } from '../../../shared/api/config/firebase-api';
import { checkExecutionTime } from '../config.js/checkExecutionTime';
import { getProdsByCategories } from './getProdsByCategories';

export async function updateCategories(modifiedCategories) {
  const { UPDATE } = DATABASE_OPERATIONS;
  const { PRODUCTS_BY_CATEGORIES: productsFolder } = DATABASE_FOLDERS;
  const { STOCK_SPREADSHEET_ID, STOCK_TESTING /* , STOCK , */, CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE } =
    SPREADSHEET;

  const compiledStockData = await stockDataBuilding(STOCK_SPREADSHEET_ID, STOCK_TESTING);
  const currentCategoryMap = getProdsByCategories(compiledStockData);

  const cacheSheetData = await getCacheSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE);

  const updatedCategories = [];

  modifiedCategories.forEach((categoryToUpdate) => {
    if (checkExecutionTime()) throw new Error('retry', { cause: 408 });

    if (!currentCategoryMap.has(categoryToUpdate)) return;
    const categoryDataToUpdate = compiledStockData.filter(({ category }) => category === categoryToUpdate);
    const cacheCategoryData = cacheSheetData.find(({ category }) => category === categoryToUpdate);
    if (!cacheCategoryData) return;

    const completeDataToUpdate = {
      folder: productsFolder,
      docLabel: categoryToUpdate,
      firestoneNameID: cacheCategoryData['firestoreName-ID'],
      data: [...categoryDataToUpdate], // Important that 'data' stays last
    };

    Logger.log(`Updating database: ${categoryToUpdate}`);
    const categoryDataToCache = DATABASE_API_ACTIONS[UPDATE](completeDataToUpdate);
    updatedCategories.push({
      category: categoryToUpdate, // Important that 'category' stays first
      ...categoryDataToCache,
    });
  });
  return [...updatedCategories];
}
