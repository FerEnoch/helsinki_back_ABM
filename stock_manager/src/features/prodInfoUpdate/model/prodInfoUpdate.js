import { getCacheSheetData, overwriteCacheSheetData } from '../../../entities/cache';
import { SPREADSHEET } from '../../../entities/sheetData/config/spreadsheet';
import { dataBuilding } from '../../../entities/sheetData/lib/dataBuilding';
import { DATABASE_FOLDERS } from '../../../shared/api/config/firebase-api';
import { getProdsByCategories } from '../lib/getProdsByCategories';
import { getProdsFromCache } from '../lib/getProdsFromCache';
import { deleteFirebaseCollection } from '../lib/deleteFirebaseCollection';
import { createFirestoreDocs } from '../lib/createFirestoreDocs';
import { updateWebAppProdCatCache } from '../lib/updateWebAppProdCatCache';
import { checkIfNeedToRevalidate } from './checkIfNeedToRevalidate';

export async function prodInfoUpdate() {
  const { CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE, PRODUCTS_COMBOS_CACHE, STOCK, COMBOS } = SPREADSHEET;
  const { PRODUCTS_BY_CATEGORIES: productsFolder, PRODUCTS_COMBOS: combosFolder } = DATABASE_FOLDERS;

  let message = 'success';
  let categoriesToCache;
  let combosToCache;
  let revalidateProdsCategories;
  let revalidateProdsCombos;

  try {
    const [compiledStockData, compiledCombosData] = await Promise.all([dataBuilding(STOCK), dataBuilding(COMBOS)]);
    const [currentCategoryMap, currentCombosMap] = await Promise.all([
      getProdsByCategories(compiledStockData),
      getProdsByCategories(compiledCombosData),
    ]);
    // const currentCombosMap = buildCombosInfo(compiledCombosData);
    Logger.log(`
    Total found categories --> ${currentCategoryMap.size}
    Total found combos --> ${compiledCombosData.length}
    `);

    if (!currentCategoryMap) {
      message = 'Unable to build products by categories to update firestore database';
      throw new Error(message);
    }

    const [categoriesCacheSheetData, combosCacheSheetData] = await Promise.all([
      getCacheSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE),
      getCacheSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_COMBOS_CACHE),
    ]);

    if (!categoriesCacheSheetData.length) {
      Logger.log(`CACHE IS EMPTY --> creating firestore docs: products by categories and combos`);
      /**
       * Es la acción inicial: no hay cache, es decir, es la primera carga.
       * Si no hay cache de categorías, no debería haber de combos tampoco.
       */
      categoriesToCache = createFirestoreDocs({
        documents: [...currentCategoryMap.entries()],
        collection: productsFolder,
      });
      Logger.log(`Adding products to cache sheet`);
      await overwriteCacheSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE, [...categoriesToCache]);
      /**
       * refactor en promesas
       */
      // createFirestoreDocs w/combos
      combosToCache = createFirestoreDocs({
        documents: [...currentCombosMap.entries()],
        collection: combosFolder,
      });
      Logger.log(`Adding combos to cache sheet`);
      await overwriteCacheSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_COMBOS_CACHE, [...combosToCache]);
      // revalidate web app
      // updateWebAppProdCatCache({ action: 'PATCH', path: 'compose', content: { tag: 'REVALIDATE' } });
      revalidateProdsCategories = true;
    } else {
      Logger.log(`FOUND CACHE PRODUCTS --> Evaluate actions to update Firebase and cache sheet.`);

      const cacheProducts = getProdsFromCache(categoriesCacheSheetData);
      revalidateProdsCategories = await checkIfNeedToRevalidate(compiledStockData, cacheProducts);

      /**
       * refactor en promesas
       */

      if (revalidateProdsCategories) {
        Logger.log('Executing actions...');
        /**
         * Ya que borrar la colección completa vía rest API no se puede,
         * Opté por borrar cada documento (vaciar la colección), y crear los nuevos
         */
        // delete firebase cache
        deleteFirebaseCollection({ collection: productsFolder });
        // create new collection
        Logger.log(`REVALIDATING CACHE --> creating firestore docs: products by categories`);
        /** refactorizar en promesas */
        categoriesToCache = createFirestoreDocs({
          documents: [...currentCategoryMap.entries()],
          collection: productsFolder,
        });
        Logger.log(`Adding products to cache sheet`);
        await overwriteCacheSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE, [...categoriesToCache]);
        // revalidate web app
        // updateWebAppProdCatCache({ action: 'PATCH', path: 'compose', content: { tag: 'REVALIDATE' } });
      }

      if (combosCacheSheetData.length > 0) {
        const cacheCombos = getProdsFromCache(combosCacheSheetData);
        revalidateProdsCombos = await checkIfNeedToRevalidate(compiledCombosData, cacheCombos);

        if (revalidateProdsCombos) {
          deleteFirebaseCollection({ collection: combosFolder });
          Logger.log(`REVALIDATING CACHE --> creating firestore docs: combos`);
          /** refactorizar en promesas */
          combosToCache = createFirestoreDocs({
            documents: [...currentCombosMap.entries()],
            collection: combosFolder,
          });
          Logger.log(`Adding combos to cache sheet`);
          await overwriteCacheSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_COMBOS_CACHE, [...combosToCache]);
          // revalidate web app
          // updateWebAppProdCatCache({ action: 'PATCH', path: 'compose', content: { tag: 'REVALIDATE' } });
        }
      } else {
        combosToCache = createFirestoreDocs({
          documents: [...currentCombosMap.entries()],
          collection: combosFolder,
        });
        Logger.log(`Adding combos to cache sheet`);
        await overwriteCacheSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_COMBOS_CACHE, [...combosToCache]);
        // revalidate web app
        // updateWebAppProdCatCache({ action: 'PATCH', path: 'compose', content: { tag: 'REVALIDATE' } });
        revalidateProdsCombos = true;
      }
    }
    const isNeededToRevalidateCache = revalidateProdsCategories || revalidateProdsCombos;
    if (isNeededToRevalidateCache) {
      // revalidate web app
      Logger.log('Updating web app cache');
      // updateWebAppProdCatCache({ action: 'PATCH', path: 'compose', content: { tag: 'REVALIDATE' } });
      const { message: responseMessage, code } = updateWebAppProdCatCache({
        action: 'PATCH',
        path: 'compose',
        content: { tag: 'REVALIDATE' },
      });
      Logger.log(`${responseMessage} - Response status: ${code}`);
    }
    Logger.log('DONE!');
    return {
      message,
      isNeededToRevalidateCache,
      totalProducts: compiledStockData.length,
      totalCombos: compiledCombosData.length,
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
