import { getCacheSheetData, overwriteCacheSheetData } from '../../../entities/cache';
import { SPREADSHEET } from '../../../entities/sheetData/config/spreadsheet';
import { stockDataBuilding } from '../../../entities/sheetData/lib/stockDataBuilding';
import { DATABASE_API_ACTIONS } from '../../../shared/api';
import { DATABASE_OPERATIONS } from '../../../shared/api/config/database-operations';
import { DATABASE_FOLDERS } from '../../../shared/api/config/firebase-api';
import { analizeProductsToUpdateDatabase } from '../../databaseUpdate/lib/analizeProductsToUpdateDatabase';
import { getProdsByCategories } from '../lib/getProdsByCategories';
import { getProdsFromCache } from '../lib/getProdsFromCache';
import { PROD_CATEGORY_CRUD_CONTROLLER } from './crudController';

export async function prodInfoUpdate() {
  try {
    const { STOCK_SPREADSHEET_ID, STOCK_TESTING /* , STOCK */, CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE } =
      SPREADSHEET;
    const { PRODUCTS_BY_CATEGORIES: productsFolder } = DATABASE_FOLDERS;
    const { CREATE, LEAVE } = DATABASE_OPERATIONS;

    let message = 'success';
    let isNeededToUpdateProductsInfo;
    let getOperationdResult;

    const compiledStockData = await stockDataBuilding(STOCK_SPREADSHEET_ID, STOCK_TESTING);
    const currentCategoryMap = getProdsByCategories(compiledStockData);
    Logger.log(`Total found categories --> ${currentCategoryMap.size}`); // -> 13

    if (!currentCategoryMap) {
      message = 'Unable to build products by categories to update firestore database';
      throw new Error(message);
    }

    const cacheSheetData = await getCacheSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE);

    if (!cacheSheetData.length) {
      const firestoreProductsInfoToCache = [];
      isNeededToUpdateProductsInfo = true;
      Logger.log(`CACHE IS EMPTY --> creating firestore docs: products by categories`);
      /**
       * Es la acción inicial: no hay cache, es decir, es la primera carga.
       * borrar todo firebase por precaución, para actualizar todo junto
       */
      [...currentCategoryMap.entries()].forEach(([category, prods]) => {
        Logger.log(`Creating firestore category: ${category}`);
        const firestoreProductsDocument = {
          folder: productsFolder,
          docLabel: category,
          data: [...prods],
        };
        const returnedInfo = DATABASE_API_ACTIONS[CREATE](firestoreProductsDocument);
        firestoreProductsInfoToCache.push({
          category,
          ...returnedInfo,
        });
      });
      Logger.log(`Adding products to cache sheet`);
      await overwriteCacheSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE, [...firestoreProductsInfoToCache]);
    } else {
      Logger.log(`FOUND CACHE INFO --> Updating Firebase and cache sheet.`);

      const cacheProducts = getProdsFromCache(cacheSheetData);
      const actionsByProduct = analizeProductsToUpdateDatabase(compiledStockData, cacheProducts);

      Logger.log(`ANALIZED PRODUCTS: ${compiledStockData.length}`);
      const actionsByCategory = actionsByProduct.map(({ action, content }) => {
        const categorySet = new Set();
        if (content.length > 0) {
          isNeededToUpdateProductsInfo = action !== LEAVE;
          if (!isNeededToUpdateProductsInfo) return null;
          content.forEach((prod) => {
            if (Object.hasOwn(prod, 'firestoreName-ID')) delete prod['firestoreName-ID']; /* eslint-disable-line */
            categorySet.add(prod.category);
          });
          Logger.log(`ACTION: ${action} ${content.length} PRODUCTS - CATEGORIES: ${[...categorySet]}`);
          return [action, [...categorySet], [...content]];
        }
        return null;
      });

      Logger.log('Executing actions...');
      getOperationdResult = Promise.all(
        actionsByCategory.map(async (analizingProcessResult) => {
          if (!analizingProcessResult) return;
          const [action, modifiedCategories, modifiedProducts] = analizingProcessResult;

          try {
            // case CREATE:
            // case UPDATE:
            // case DELETE:
            // const operationResult =
            await PROD_CATEGORY_CRUD_CONTROLLER[action]([...modifiedCategories], [...modifiedProducts]);
          } catch (e) {
            // hasWebAppBeenUpdatedSuccessfully = false;
              console.error( /* eslint-disable-line */
              `***/**** Something happened with ${action} action with this categories: ${modifiedCategories}`,
              e.message
            );
          }
        })
      );
      // console.log('Final result to cache ->', firestoreProductsInfoToCache);
    }
    await getOperationdResult;
    Logger.log('DONE!');
    return { message, isNeededToUpdateProductsInfo, totalProducts: compiledStockData.length };
  } catch (e) {
    if (e.cause === 429) {
      return e.message;
    }
    throw e;
  }
}
