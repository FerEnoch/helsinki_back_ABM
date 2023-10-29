import { dataBuilding } from '../../../entities/sheetData/lib/dataBuilding';
import { SPREADSHEET } from '../../../entities/sheetData/config/spreadsheet';
import { getCacheSheetData, overwriteCacheSheetData } from '../../../entities/cache';
import { analizeProductsToUpdateDatabase } from '../lib/analizeProductsToUpdateDatabase';
import { DATABASE_API_ACTIONS, WEB_APP_API_ACTIONS } from '../../../shared/api';
import { DATABASE_OPERATIONS } from '../../../shared/api/config/database-operations';
import { firebaseDatabaseDeleteFiles } from './firebaseDatabaseDeleteFiles';
import { getFirestoreDocsList } from '../../../shared/api/model/getFirestoreCurrentDocs';
import { ERROR_MESSAGES } from '../../../shared/api/config/firebase-api';
import { UI_MESSAGES } from '../config/ui-messages';

/**
 * TO DO
 *      - que revise si todas las imágenes del storage corresponden a un producto, si
 * no, que las borre. Hacer esto después de todas las operaciones - NO agregar un borrado
 * de imagen junto con el borrado de producto... hacer la limpieza toda junta al finalizar.
 *
 *      - arreglar errores y mensajes - refactorizar para sacar magic-strings
 *
 *      - Que las acciones update, delete y add del cache sean mas granulares, y no se
 *        actualice todo junto
 *
 */

export async function databaseController() {
  try {
    const compiledStockData = await dataBuilding(SPREADSHEET.STOCK_SPREADSHEET_ID, SPREADSHEET.STOCK);
    const cacheSheetData = await getCacheSheetData();

    if (!compiledStockData.length) {
      throw new Error('Unable to build data from Stock Sheet to update firestore database');
    }

    let isFirestoreToUpdate = false;
    let isWebAppCacheUpToDate = false;
    let hasWebAppBeenUpdatedSuccessfully = true;
    let finallyUpdatedProducts = [];

    // Si la cache tiene la misma cantidad de productos que el stock, asumimos la cache actualizada:
    if (compiledStockData.length === cacheSheetData.length) Logger.log('Cache seems to be right... analizing');
    const actionContentValues = analizeProductsToUpdateDatabase(compiledStockData, cacheSheetData);

    actionContentValues.forEach(({ action, content }) => {
      if (content.length > 0) {
        Logger.log(`PRODUCTS TO ${action}: ${content.length}`);
        isFirestoreToUpdate = action !== DATABASE_OPERATIONS.LEAVE;
        isWebAppCacheUpToDate = action !== DATABASE_OPERATIONS.LEAVE;
      }
    });

    if (isFirestoreToUpdate) {
      const firestoreCurrentDocs = getFirestoreDocsList();

      if (!firestoreCurrentDocs.length) {
        Logger.log('FIRESTORE IS EMPTY --->> Updating from stock products, creating files...');
        isFirestoreToUpdate = true;
        /**
         * Create and populate firebase firestore & cloud storage database
         */
        const uploadedProds = DATABASE_API_ACTIONS[DATABASE_OPERATIONS.ADD]([...compiledStockData]);
        /**
         * Update Web App cache
         */
        const { code, message } = WEB_APP_API_ACTIONS[DATABASE_OPERATIONS.ADD](uploadedProds);
        isWebAppCacheUpToDate = code === 200 && message === 'Success';
        /**
         * Update local cache sheet
         */
        finallyUpdatedProducts = [...uploadedProds];
        Logger.log(
          `CACHE IS EMPTY OR OUTDATED --> Clearing and adding ${finallyUpdatedProducts.length} products to cache sheet`
        );
        await overwriteCacheSheetData(finallyUpdatedProducts);
      } else {
        Logger.log(`FOUND ${firestoreCurrentDocs.length} FIRESTORE PRODUCTS! Now Getting cache...`);
        /**
         *  If cached prods are NOT the same amount that firestore documents, asume cache are outdated.
         */
        if (cacheSheetData.length === firestoreCurrentDocs.length) {
          Logger.log('Executing actions...');
          actionContentValues.forEach(({ action, content }) => {
            try {
              if (content.length > 0) {
                /**
                 * Update firestore
                 */
                const operationResultProducts = DATABASE_API_ACTIONS[action](content);
                operationResultProducts?.forEach((updatedProd) => {
                  if (updatedProd) {
                    finallyUpdatedProducts.push(updatedProd);
                  }
                });
                /**
                 * Update Web App cache
                 */
                if (action !== DATABASE_OPERATIONS.LEAVE) {
                  const { code, message } = WEB_APP_API_ACTIONS[action](content);
                  isWebAppCacheUpToDate = code === 200 && message === 'Success';
                  if (!isWebAppCacheUpToDate) throw new Error(message, { cause: code });
                }
              }
            } catch (e) {
              hasWebAppBeenUpdatedSuccessfully = false;
              console.error( /* eslint-disable-line */
                `***/**** Something happened with ${action} action with this content:\n
                ${content.map((prod) => `id: ${prod?.id}, name: ${prod?.name}\n`)}
                WEB APP RESPONSE:
                  Code: ${e.cause}
                  Message: ${e.message}`
              );
            }
          });

          /**
           * Local cache sheet data is updated entirely anyway
           */
          // console.log('{{{--FINAL--}}} PRODUCTS TO CACHE ---->>>', finallyUpdatedProducts.length); /* eslint-disable-line */
          if (finallyUpdatedProducts.length > 0) {
            Logger.log('UPDATING CACHE SHEET...');
            await overwriteCacheSheetData(finallyUpdatedProducts);
            Logger.log('DONE!');
          }
        } else {
          Logger.log(
            `CACHE IS EMPTY OR OUTDATED with ${cacheSheetData.length} products --> Clearing and adding ${compiledStockData.length} products to cache sheet`
          );
          Logger.log('Clearing firebase first in order to update both...');

          // const firestoreCurrentDocNameIDs = firestoreCurrentDocs.map(
          //   (firestoreProd) => firestoreProd['firestoreName-ID']
          // );
          firebaseDatabaseDeleteFiles(firestoreCurrentDocs);

          const uploadedProds = DATABASE_API_ACTIONS[DATABASE_OPERATIONS.ADD]([...compiledStockData]);

          /**
           * Update the local cache sheet
           */
          Logger.log('Populating cache...');
          finallyUpdatedProducts = [...uploadedProds];
          await overwriteCacheSheetData(finallyUpdatedProducts);

          // console.log('{{{--FINAL--}}} PRODUCTS TO CACHE ---->>>', finallyUpdatedProducts.length); /* eslint-disable-line */
          Logger.log('DONE!');
        }
      }
    }

    /**
     * Logs and give feedback to user
     */

    const loggerFinalLocalCacheLength = isFirestoreToUpdate
      ? `---*/--- Finally ${finallyUpdatedProducts.length} products locally cached in sheet ---*/---\n`
      : `---*/--- ${cacheSheetData.length} in cache => Cache is up to date :)\n`;

    const loggerWebAppCacheUpdated =
      isWebAppCacheUpToDate && hasWebAppBeenUpdatedSuccessfully
        ? `---*/--- WEB APP cache updated successfully :)\n`
        : '---*/--- Web app NOT updated: there was NOT NECESSARY or some ERROR OCURRED\n';

    console.log(  /* eslint-disable-line */
      `---*/--- Stock data initially compiled: ${compiledStockData.length} products ---*/---\n`,
      loggerFinalLocalCacheLength,
      `---*/--- Was necessary to update firestore: ${isFirestoreToUpdate} ---*/---\n`,
      `---*/--- Web app cache updated successfully: ${
        isWebAppCacheUpToDate && hasWebAppBeenUpdatedSuccessfully
      } ---*/---\n`,
      loggerWebAppCacheUpdated
    );

    if (isFirestoreToUpdate && isWebAppCacheUpToDate && compiledStockData.length === finallyUpdatedProducts.length) {
      return UI_MESSAGES.UPDATE_SUCCESS(finallyUpdatedProducts.length);
    }
    if (!isFirestoreToUpdate && !isWebAppCacheUpToDate) {
      return UI_MESSAGES.UPDATE_NOT_NECESSARY;
    }
    return ERROR_MESSAGES.GENERIC;
  } catch (e) {
    if (e.cause === 429) {
      return e.message;
    }
    throw e;
  }
}
