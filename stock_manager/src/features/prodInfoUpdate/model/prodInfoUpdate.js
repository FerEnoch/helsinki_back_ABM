import { getCacheSheetData, overwriteCacheSheetData } from '../../../entities/cache';
import { SPREADSHEET } from '../../../entities/sheetData/config/spreadsheet';
import { dataBuilding } from '../../../entities/sheetData/lib/dataBuilding';
import { DATABASE_FOLDERS } from '../../../shared/api/config/firebase-api';
import { getProdsByCategories } from '../lib/getProdsByCategories';
import { deleteFirebaseCollection } from '../lib/deleteFirebaseCollection';
import { createFirestoreDocs } from '../lib/createFirestoreDocs';
import { updateWebAppProdCatCache } from '../lib/updateWebAppProdCatCache';
import { checkIfNeedToRevalidate } from './checkIfNeedToRevalidate';

export async function prodInfoUpdate() {
  const { CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE, PRODUCTS_COMBOS_CACHE, STOCK, COMBOS } = SPREADSHEET;
  const { PRODUCTS_BY_CATEGORIES: productsFolder, PRODUCTS_COMBOS: combosFolder } = DATABASE_FOLDERS;

  let message = 'success';
  let revalidateProdsCategories;
  let revalidateProdsCombos;

  try {
    const [buildedStockData, buildedCombosData, categoriesCacheSheetData, combosCacheSheetData] = await Promise.all([
      dataBuilding(STOCK),
      dataBuilding(COMBOS),
      getCacheSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE),
      getCacheSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_COMBOS_CACHE),
    ]);
    const [currentCategoryMap, currentCombosMap] = await Promise.all([
      getProdsByCategories(buildedStockData),
      getProdsByCategories(buildedCombosData),
    ]);
    // const currentCombosMap = buildCombosInfo(compiledCombosData);
    Logger.log(`
    Total found individual products --> ${buildedStockData.length}
    Total found categories --> ${currentCategoryMap.size}
    Total found combos --> ${buildedCombosData.length}
    `);

    if (currentCategoryMap.size === 0) {
      message = 'Unable to build products by categories to update firestore database';
      throw new Error(message);
    }

    if (!categoriesCacheSheetData.length) {
      Logger.log(`CATEGORIES CACHE IS EMPTY --> creating products by categories AND combos from scratch`);
      /**
       * Es la acción inicial: no hay cache, es decir, es la primera carga.
       * Si no hay cache de categorías, no debería haber de combos tampoco.
       */
      await Promise.all([
        createFirestoreDocs({
          documents: [...currentCategoryMap.entries()],
          collection: productsFolder,
        }).then(async (toCache) => {
          Logger.log(`Adding products by categories to cache sheet`);
          await overwriteCacheSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE, toCache);
        }),
        createFirestoreDocs({
          documents: [...currentCombosMap.entries()],
          collection: combosFolder,
        }).then(async (toCache) => {
          Logger.log(`Adding combos to cache sheet`);
          await overwriteCacheSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_COMBOS_CACHE, toCache);
        }),
      ]);
      revalidateProdsCategories = true;
    } else {
      Logger.log(`FOUND CACHE PRODUCTS BY CATEGORIES --> Evaluate actions to update.`);

      revalidateProdsCategories = await checkIfNeedToRevalidate(buildedStockData, categoriesCacheSheetData);

      if (revalidateProdsCategories) {
        Logger.log('Executing actions...');
        /**
         * Ya que borrar la colección completa vía rest API no se puede,
         * Opté por borrar cada documento (vaciar la colección), y crear los nuevos
         */
        // delete firebase cache
        await deleteFirebaseCollection({ collection: productsFolder });
        // create new collection
        Logger.log(`Revalidating PRODUCTS BY CATEGORIES cache`);
        createFirestoreDocs({
          documents: [...currentCategoryMap.entries()],
          collection: productsFolder,
        }).then(async (toCache) => {
          Logger.log(`Adding products to cache sheet`);
          await overwriteCacheSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE, toCache);
        });
        // revalidate web app
        // updateWebAppProdCatCache({ action: 'PATCH', path: 'compose', content: { tag: 'REVALIDATE' } });
      }

      if (combosCacheSheetData.length > 0) {
        Logger.log(`FOUND CACHE COMBOS --> Evaluate actions to update`);

        revalidateProdsCombos = await checkIfNeedToRevalidate(buildedCombosData, combosCacheSheetData);

        if (revalidateProdsCombos) {
          await deleteFirebaseCollection({ collection: combosFolder });
          Logger.log(`Revalidating COMBOS cache`);
          createFirestoreDocs({
            documents: [...currentCombosMap.entries()],
            collection: combosFolder,
          }).then(async (toCache) => {
            Logger.log(`Adding combos to cache sheet`);
            await overwriteCacheSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_COMBOS_CACHE, toCache);
          });
          // revalidate web app
          // updateWebAppProdCatCache({ action: 'PATCH', path: 'compose', content: { tag: 'REVALIDATE' } });
        }
      } else if (currentCombosMap?.size > 0) {
        Logger.log(`COMBOS CACHE IS EMPTY --> creating combos from scratch`);
        createFirestoreDocs({
          documents: [...currentCombosMap.entries()],
          collection: combosFolder,
        }).then(async (toCache) => {
          Logger.log(`Adding combos to cache sheet`);
          await overwriteCacheSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_COMBOS_CACHE, toCache);
        });
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
      try {
        const { message: responseMessage, code } = await updateWebAppProdCatCache({
          action: 'PATCH',
          path: 'compose',
          content: { tag: 'REVALIDATE' },
        });
        Logger.log(`${responseMessage} - Response status: ${code}`);
      } catch (err) {
        console.error('*****/***** Could not connect with server..'); // eslint-disable-line
      }
    }
    Logger.log('DONE!');
    return {
      message,
      isNeededToRevalidateCache,
      totalProducts: buildedStockData.length,
      totalCombos: buildedCombosData.length,
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
