import { getCacheSheetData, overwriteCacheSheetData } from '../../../entities/cache';
import { COLUMN_HEADERS, SPREADSHEET } from '../../../entities/sheetData/config/spreadsheet';
import { fetchSheetData } from '../../../entities/sheetData/lib/fetchSheetData';
import { INFO_DATABASE_API_ACTIONS } from '../../../shared/api';
import { DATABASE_OPERATIONS } from '../../../shared/api/config/database-operations';
import { DATABASE_FOLDERS } from '../../../shared/api/config/firebase-api';
import { buildHelsinkiInfoContent } from '../lib/buildHelsinkiInfoContent';

export async function updateAppInfo() {
  const { STOCK_SPREADSHEET_ID, INFO, ACCOUNT, CACHE_SPREADSHEET_ID, INFO_CACHE } = SPREADSHEET;
  const { MAIN_SHEET_INFO: informationHeaders, MAIN_SHEET_ACCOUNT: accountHeaders } = COLUMN_HEADERS;
  const { ADD, UPDATE } = DATABASE_OPERATIONS;
  const { INFO: infoFolder, PAYMENT_METHODS } = DATABASE_FOLDERS;
  let message = 'success';

  const { rawData: helsinkiInfo } = await fetchSheetData(STOCK_SPREADSHEET_ID, INFO, informationHeaders);
  const { rawData: helsinkiAccount } = await fetchSheetData(STOCK_SPREADSHEET_ID, ACCOUNT, accountHeaders);

  const [compiledInfo, ...compiledMPaymentMethods] = buildHelsinkiInfoContent(helsinkiInfo, helsinkiAccount);

  if (!compiledMPaymentMethods.length) {
    message = 'Unable to build account data to update firestore database';
    throw new Error(message);
  }

  const cacheSheetData = await getCacheSheetData(CACHE_SPREADSHEET_ID, INFO_CACHE, informationHeaders);

  const firestoreInfoDocument = {
    folder: infoFolder,
    docLabel: infoFolder,
    data: [{ ...compiledInfo }],
  };

  const firestorePaymentMethodsDocument = {
    folder: PAYMENT_METHODS,
    docLabel: PAYMENT_METHODS,
    data: [...compiledMPaymentMethods],
  };

  let dataInfoToCache;
  let dataPaymentMethodsToCache;

  if (!cacheSheetData.length) {
    Logger.log(`CACHE IS EMPTY --> creating firestore docs: info and paymentMethods `);
    dataInfoToCache = INFO_DATABASE_API_ACTIONS[ADD](firestoreInfoDocument);
    dataPaymentMethodsToCache = INFO_DATABASE_API_ACTIONS[ADD](firestorePaymentMethodsDocument);
    Logger.log(`Adding info and paymentMethods as INFO to cache sheet`);
  } else {
    Logger.log(`FOUND CACHE INFO --> Updating Firebase and overwriting info sheet anyway.`);

    const [info, paymentMethods] = cacheSheetData;

    const infoToUpdate = {
      folder: infoFolder,
      docLabel: infoFolder,
      firestoneNameID: info['firestoreName-ID'],
      data: [{ ...compiledInfo }],
    };
    dataInfoToCache = INFO_DATABASE_API_ACTIONS[UPDATE](infoToUpdate);

    const paymentMethodsToUpdate = {
      folder: PAYMENT_METHODS,
      docLabel: PAYMENT_METHODS,
      firestoneNameID: paymentMethods['firestoreName-ID'],
      data: [...compiledMPaymentMethods],
    };
    dataPaymentMethodsToCache = INFO_DATABASE_API_ACTIONS[UPDATE](paymentMethodsToUpdate);
  }

  await overwriteCacheSheetData(CACHE_SPREADSHEET_ID, INFO_CACHE, [
    { ...dataInfoToCache },
    { ...dataPaymentMethodsToCache },
  ]);
  Logger.log('DONE!');

  return { message };
}
