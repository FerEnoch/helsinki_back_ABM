import { getCacheSheetData, overwriteCacheSheetData } from '../../../entities/cache';
import { SPREADSHEET } from '../../../entities/sheetData/config/spreadsheet';
import { stockDataBuilding } from '../../../entities/sheetData/lib/stockDataBuilding';
// import { DATABASE_API_ACTIONS } from '../../../shared/api';
import { DATABASE_OPERATIONS } from '../../../shared/api/config/database-operations';
import { DATABASE_FOLDERS } from '../../../shared/api/config/firebase-api';
import { analizeProductsToUpdateDatabase } from '../../databaseUpdate/lib/analizeProductsToUpdateDatabase';
// import { checkExecutionTime } from '../config.js/checkExecutionTime';
import { getProdsByCategories } from '../lib/getProdsByCategories';
import { getProdsFromCache } from '../lib/getProdsFromCache';
import { deleteFirebaseCollection } from '../lib/deleteFirebaseCollection';
// import { PROD_CATEGORY_CRUD_CONTROLLER } from './crudController';
import { createFirestoreDocs } from '../lib/createFirestoreDocs';
import { updateWebAppProdCatCache } from '../lib/updateWebAppProdCatCache';

export async function prodInfoUpdate() {
  const { STOCK_SPREADSHEET_ID, STOCK, CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE } = SPREADSHEET;
  const { PRODUCTS_BY_CATEGORIES: productsFolder } = DATABASE_FOLDERS;
  const { LEAVE } = DATABASE_OPERATIONS;

  let message = 'success';
  const isCacheOudated = new Set();
  let categoriesToCache;
  // let getOperationdResult;

  try {
    const compiledStockData = await stockDataBuilding(STOCK_SPREADSHEET_ID, STOCK);
    const currentCategoryMap = getProdsByCategories(compiledStockData);
    Logger.log(`Total found categories --> ${currentCategoryMap.size}`);

    if (!currentCategoryMap) {
      message = 'Unable to build products by categories to update firestore database';
      throw new Error(message);
    }

    const cacheSheetData = await getCacheSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE);

    if (!cacheSheetData.length) {
      // isNeededToRevalidateCache = true;
      Logger.log(`CACHE IS EMPTY --> creating firestore docs: products by categories`);
      /**
       * Es la acción inicial: no hay cache, es decir, es la primera carga.
       * No es necesario revalidar la web app cache
       */
      categoriesToCache = createFirestoreDocs({
        documents: [...currentCategoryMap.entries()],
        collection: productsFolder,
      });

      Logger.log(`Adding products to cache sheet`);
      await overwriteCacheSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE, [...categoriesToCache]);
    } else {
      Logger.log(`FOUND CACHE INFO --> Updating Firebase and cache sheet.`);

      const cacheProducts = getProdsFromCache(cacheSheetData);

      const actionsByProduct = analizeProductsToUpdateDatabase(compiledStockData, cacheProducts);

      Logger.log(`ANALIZED PRODUCTS: ${compiledStockData.length}`);
      // const actionsByCategory =
      actionsByProduct.forEach(({ action, content }) => {
        const categorySet = new Set();
        if (content.length > 0) {
          isCacheOudated.add(action !== LEAVE);
          // if (!isNeededToRevalidateCache) return null;
          content.forEach((prod) => {
            //   if (Object.hasOwn(prod, 'firestoreName-ID')) delete prod['firestoreName-ID']; /* eslint-disable-line */
            categorySet.add(prod.category);
          });
          Logger.log(`ACTION: ${action} ${content.length} PRODUCTS - CATEGORIES: ${[...categorySet]}`);
          // return [action, [...categorySet], [...content]];
        }
        // return null;
      });

      if (isCacheOudated.has(true)) {
        Logger.log('Executing actions...');
        /**
         * Ya que borrar la colección completa vía rest API no se puede,
         * me queda la duda si se podría sobreescribir (la colección) de alguna manera.
         * Acá opté por borrar cada documento (vaciar la colección), y crear los nuevos
         */
        // delete firebase cache
        deleteFirebaseCollection({ collection: productsFolder });
        // create new collection
        Logger.log(`REVALIDATING CACHE --> creating firestore docs: products by categories`);
        categoriesToCache = createFirestoreDocs({
          documents: [...currentCategoryMap.entries()],
          collection: productsFolder,
        });
        Logger.log(`Adding products to cache sheet`);
        await overwriteCacheSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE, [...categoriesToCache]);
        // revalidate web app
        updateWebAppProdCatCache({ action: 'PATCH', path: 'compose', content: { tag: 'REVALIDATE' } });
      }
      //   getOperationdResult = Promise.all(
      //     actionsByCategory.map(async (analizingProcessResult) => {
      //       if (checkExecutionTime()) throw new Error('retry', { cause: 408 });

      //       if (!analizingProcessResult) return;
      //       const [action, modifiedCategories, modifiedProducts] = analizingProcessResult;

      //       try {
      //         await PROD_CATEGORY_CRUD_CONTROLLER[action]([...modifiedCategories], [...modifiedProducts]);
      //       } catch (e) {
      //         if (e.cause === 408) {
      //           throw e;
      //         } else {
      //           console.error( /* eslint-disable-line */
      //             `***/**** Something happened with ${action} action with this categories: ${modifiedCategories}`,
      //             e.message
      //           );
      //         }
      //       }
      //     })
      //   );
    }
    // await getOperationdResult;
    Logger.log('DONE!');
    return {
      message,
      isNeededToRevalidateCache: isCacheOudated.has(true),
      totalProducts: compiledStockData.length,
    };
  } catch (e) {
    if (e.cause === 408) {
      return {
        message: e.message,
      };
    }
    if (e.cause === 429) {
      return e.message;
    }
    throw e;
  }
}
