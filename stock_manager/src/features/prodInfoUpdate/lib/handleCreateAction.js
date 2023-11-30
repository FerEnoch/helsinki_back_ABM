import { getCacheSheetData } from '../../../entities/cache';
import { SPREADSHEET } from '../../../entities/sheetData/config/spreadsheet';
import { getProdsFromCache } from './getProdsFromCache';
import { handleCreateCategory } from './handleCreateCategory';
import { updateCategories } from './updateCategories';

export async function handleCreateAction(modifiedCategories, modifiedProducts) {
  const { CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE } = SPREADSHEET;
  const cacheCategories = new Set();
  const newCategorySet = new Set();
  const cacheSheetData = await getCacheSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE);
  const cacheProducts = getProdsFromCache(cacheSheetData);

  const operationResult = [];

  cacheProducts.forEach((cacheProd) => cacheCategories.add(cacheProd.category));
  modifiedCategories.forEach((category) => {
    if (!cacheCategories.has(category)) newCategorySet.add(category);
  });
  if (newCategorySet.size > 0) {
    Logger.log(`Creating new category/ies - ${[...newCategorySet]}`);
    const newCategoriesProds = modifiedProducts.filter((modProd) => newCategorySet.has(modProd.category));
    operationResult.push(handleCreateCategory([...newCategoriesProds]));
  }

  const existingCatModifiedProds = modifiedProducts.filter((modProd) => cacheCategories.has(modProd.category));

  if (existingCatModifiedProds.length > 0) {
    // se crea un producto dentro de una categoría existente. Activa UPDATE action:
    Logger.log(`New product/s added to existing categories - updating category...`);
    const result = await updateCategories([...modifiedCategories]);
    operationResult.push(result);
  }

  return operationResult.flat();
}
