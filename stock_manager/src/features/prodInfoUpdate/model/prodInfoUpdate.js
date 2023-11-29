import { getCacheSheetData, overwriteCacheSheetData } from '../../../entities/cache';
import { SPREADSHEET } from '../../../entities/sheetData/config/spreadsheet';
import { stockDataBuilding } from '../../../entities/sheetData/lib/stockDataBuilding';
import { DATABASE_API_ACTIONS } from '../../../shared/api';
import { DATABASE_OPERATIONS } from '../../../shared/api/config/database-operations';
import { DATABASE_FOLDERS } from '../../../shared/api/config/firebase-api';
import { analizeProductsToUpdateDatabase } from '../../databaseUpdate/lib/analizeProductsToUpdateDatabase';
import { getProdsByCategories } from '../lib/getProdsByCategories';
import { getProdsFromCache } from '../lib/getProdsFromCache';
import { handleCreateAction } from '../lib/handleCreateAction';

export async function prodInfoUpdate() {
  try {
    const { STOCK_SPREADSHEET_ID, STOCK_TESTING /* , STOCK */, CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE } =
      SPREADSHEET;
    const { PRODUCTS_BY_CATEGORIES: productsFolder } = DATABASE_FOLDERS;
    const { CREATE, UPDATE, DELETE, LEAVE } = DATABASE_OPERATIONS;

    let message = 'success';
    let isNeededToUpdateProductsInfo;

    const compiledStockData = await stockDataBuilding(STOCK_SPREADSHEET_ID, STOCK_TESTING);
    const currentCategoryMap = getProdsByCategories(compiledStockData);
    Logger.log(`Total found categories --> ${currentCategoryMap.size}`); // -> 12

    if (!currentCategoryMap) {
      message = 'Unable to build products by categories to update firestore database';
      throw new Error(message);
    }

    const cacheSheetData = await getCacheSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE);
    const firestoreProductsInfoToCache = [];

    if (!cacheSheetData.length) {
      isNeededToUpdateProductsInfo = true;
      Logger.log(`CACHE IS EMPTY --> creating firestore docs: products by categories`);
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
    } else {
      Logger.log(`FOUND CACHE INFO --> Updating Firebase and overwriting info sheet anyway.`);

      const cacheProducts = getProdsFromCache(cacheSheetData);
      const actionsByProduct = analizeProductsToUpdateDatabase(compiledStockData, cacheProducts);

      Logger.log(`ANALIZED PRODUCTS: ${compiledStockData.length}`);
      const actionsByCategory = actionsByProduct.map(({ action, content }) => {
        const categorySet = new Set();
        if (content.length > 0) {
          isNeededToUpdateProductsInfo = action !== LEAVE;
          if (!isNeededToUpdateProductsInfo) return null;
          content.forEach((prod) => categorySet.add(prod.category));
          Logger.log(`ACTION: ${action} ${content.length} PRODUCTS - CATEGORIES: ${[...categorySet]}`);
          return [action, [...categorySet], [...content]];
        }
        return null;
      });

      Logger.log('Executing actions...');
      actionsByCategory.forEach((analizingProcessResult) => {
        if (!analizingProcessResult) return;
        const [action, modifiedCategories, modifiedProducts] = analizingProcessResult;

        try {
          switch (action) {
            case CREATE:
              handleCreateAction([...modifiedCategories], [...modifiedProducts]).then(
                firestoreProductsInfoToCache.push
              );
              break;
            case UPDATE:
              // se actualiza un producto dentro de una categoría
              break;
            case DELETE:
              // se borra una categoría entera
              // se borra un producto dentro de una categoría
              break;
            default:
          }
          /**
           * Update firestore old way
           */
          // const operationResultProducts = PRODUCTS_DATABASE_API_ACTIONS[action](content);
          // operationResultProducts?.forEach((updatedProd) => {
          //   if (updatedProd) {
          //     finallyUpdatedProducts.push(updatedProd);
          //   }
          // });
          /**
           * Update Web App cache
           */
          // if (action !== LEAVE) {
          //   const { code, message } = WEB_APP_API_ACTIONS[action](content);
          //   isWebAppCacheUpToDate = code === 200 && message === 'Success';
          //   if (!isWebAppCacheUpToDate) throw new Error(message, { cause: code });
          // }
          /**
           *  new way
           */
          // const infoToUpdate = {
          //   folder: infoFolder,
          //   docLabel: infoFolder,
          //   firestoneNameID: info['firestoreName-ID'],
          //   data: [{ ...compiledInfo }],
          // };
          // dataInfoToCache = DATABASE_API_ACTIONS[UPDATE](infoToUpdate);
          // updateWebApp({ label: infoFolder });
        } catch (e) {
          // hasWebAppBeenUpdatedSuccessfully = false;
              console.error( /* eslint-disable-line */
            `***/**** Something happened with ${action} action with this categories: ${modifiedCategories}`
          );
        }
      });
    }

    console.log('final result to cache ->', firestoreProductsInfoToCache);
    // await overwriteCacheSheetData(CACHE_SPREADSHEET_ID, PRODUCTS_CATEGORIES_CACHE, [...firestoreProductsInfoToCache]);
    Logger.log('DONE!');

    return { message, isNeededToUpdateProductsInfo, totalProducts: compiledStockData.length };
  } catch (e) {
    if (e.cause === 429) {
      return e.message;
    }
    throw e;
  }
}
