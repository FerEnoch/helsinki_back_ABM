import { getCacheSheetData } from '../../../entities/cache';
import { SPREADSHEET } from '../../../entities/sheetData/config/spreadsheet';
import { stockDataBuilding } from '../../../entities/sheetData/lib/stockDataBuilding';
import { DATABASE_API_ACTIONS } from '../../../shared/api';
import { DATABASE_OPERATIONS } from '../../../shared/api/config/database-operations';
import { DATABASE_FOLDERS } from '../../../shared/api/config/firebase-api';
import { getProdsByCategories } from './getProdsByCategories';

export async function updateCategories(modifiedCategories) {
  const { UPDATE } = DATABASE_OPERATIONS;
  const { PRODUCTS_BY_CATEGORIES: productsFolder } = DATABASE_FOLDERS;
  const { STOCK_SPREADSHEET_ID, STOCK_TESTING /* , STOCK , */, CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE } =
    SPREADSHEET;

  const compiledStockData = await stockDataBuilding(STOCK_SPREADSHEET_ID, STOCK_TESTING);
  const currentCategoryMap = getProdsByCategories(compiledStockData);

  const cacheSheetData = await getCacheSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE);

  const firestoreProductsUpdated = [];

  modifiedCategories.forEach((categoryToUpdate) => {
    if (!currentCategoryMap.has(categoryToUpdate)) return;
    const categoryDataToUpdate = compiledStockData.filter(({ category }) => category === categoryToUpdate);
    const cacheCategoryData = cacheSheetData.find((cacheData) => cacheData.category === categoryToUpdate);

    const completeDataToUpdate = {
      folder: productsFolder,
      docLabel: categoryToUpdate,
      firestoneNameID: cacheCategoryData['firestoreName-ID'],
      data: [...categoryDataToUpdate],
    };

    Logger.log(`Updating database category: ${categoryToUpdate}`);
    const categoryDataToCache = DATABASE_API_ACTIONS[UPDATE](completeDataToUpdate);
    firestoreProductsUpdated.push({
      category: categoryToUpdate,
      ...categoryDataToCache,
    });
  });

  return [...firestoreProductsUpdated];
}
