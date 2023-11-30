import { getCacheSheetData } from '../../../entities/cache';
import { SPREADSHEET } from '../../../entities/sheetData/config/spreadsheet';
import { stockDataBuilding } from '../../../entities/sheetData/lib/stockDataBuilding';

export async function getDeletePosibilities(modifiedCategories) {
  const catEnterelyDeleted = [];
  const catWithLessProds = [];
  const { STOCK_SPREADSHEET_ID, STOCK_TESTING /* , STOCK , */, CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE } =
    SPREADSHEET;

  const compiledStockData = await stockDataBuilding(STOCK_SPREADSHEET_ID, STOCK_TESTING);
  const cacheSheetData = await getCacheSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE);

  modifiedCategories.forEach((modCategory) => {
    const categoryDataToUpdate = compiledStockData.filter(({ category }) => category === modCategory);
    const cacheCategoryData = cacheSheetData.find(({ category }) => category === modCategory);
    if (!cacheCategoryData) return;

    if (categoryDataToUpdate.length === 0) {
      catEnterelyDeleted.push({
        category: cacheCategoryData.category,
        firestoreID: cacheCategoryData['firestoreName-ID'],
      });
      return;
    }

    const cacheCategoryProducts = JSON.parse(cacheCategoryData.data);
    if (categoryDataToUpdate.length !== cacheCategoryProducts.length) {
      catWithLessProds.push(modCategory);
    }
  });

  return {
    catWithLessProds,
    catEnterelyDeleted,
  };
}
