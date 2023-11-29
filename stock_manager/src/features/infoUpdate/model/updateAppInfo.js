import { getCacheSheetData, overwriteCacheSheetData } from '../../../entities/cache';
import { COLUMN_HEADERS, SPREADSHEET } from '../../../entities/sheetData/config/spreadsheet';
import { fetchSheetData } from '../../../entities/sheetData/lib/fetchSheetData';
import { DATABASE_API_ACTIONS, WEB_APP_CACHE_UPDATE } from '../../../shared/api';
import { DATABASE_OPERATIONS } from '../../../shared/api/config/database-operations';
import { DATABASE_FOLDERS } from '../../../shared/api/config/firebase-api';
import { buildHelsinkiInfoContent } from '../lib/buildHelsinkiInfoContent';

export async function updateAppInfo() {
  const { STOCK_SPREADSHEET_ID, INFO, ACCOUNT, CACHE_SPREADSHEET_ID, INFO_CACHE } = SPREADSHEET;
  const { MAIN_SHEET_INFO: informationHeaders, MAIN_SHEET_ACCOUNT: accountHeaders } = COLUMN_HEADERS;
  const { CREATE, UPDATE } = DATABASE_OPERATIONS;
  const {
    CORPORATIVE_INFO: { UPDATE: updateWebApp },
  } = WEB_APP_CACHE_UPDATE;
  const { INFO: infoFolder, PAYMENT_METHODS: paymentMethodsFolder } = DATABASE_FOLDERS;

  let message = 'success';

  const { rawData: helsinkiInfo } = await fetchSheetData(STOCK_SPREADSHEET_ID, INFO, informationHeaders);
  const { rawData: helsinkiAccount } = await fetchSheetData(STOCK_SPREADSHEET_ID, ACCOUNT, accountHeaders);

  /**
   * Agregar las FAQ como parte de INFO
   */

  const [compiledInfo, ...compiledMPaymentMethods] = buildHelsinkiInfoContent(helsinkiInfo, helsinkiAccount);

  if (!compiledMPaymentMethods.length) {
    message = 'Unable to build account data to update firestore database';
    throw new Error(message);
  }

  const firestoreInfoDocument = {
    folder: infoFolder,
    docLabel: infoFolder,
    data: [{ ...compiledInfo }],
  };

  const firestorePaymentMethodsDocument = {
    folder: paymentMethodsFolder,
    docLabel: paymentMethodsFolder,
    data: [...compiledMPaymentMethods],
  };

  let dataInfoToCache;
  let dataPaymentMethodsToCache;

  const cacheSheetData = await getCacheSheetData(CACHE_SPREADSHEET_ID, INFO_CACHE);

  if (!cacheSheetData.length) {
    Logger.log(`CACHE IS EMPTY --> creating firestore docs: info and paymentMethods`);
    dataInfoToCache = DATABASE_API_ACTIONS[CREATE](firestoreInfoDocument);
    dataPaymentMethodsToCache = DATABASE_API_ACTIONS[CREATE](firestorePaymentMethodsDocument);
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
    dataInfoToCache = DATABASE_API_ACTIONS[UPDATE](infoToUpdate);
    updateWebApp({ label: infoFolder });

    const paymentMethodsToUpdate = {
      folder: paymentMethodsFolder,
      docLabel: paymentMethodsFolder,
      firestoneNameID: paymentMethods['firestoreName-ID'],
      data: [...compiledMPaymentMethods],
    };
    dataPaymentMethodsToCache = DATABASE_API_ACTIONS[UPDATE](paymentMethodsToUpdate);
    updateWebApp({ label: paymentMethodsFolder });
  }

  await overwriteCacheSheetData(CACHE_SPREADSHEET_ID, INFO_CACHE, [
    { ...dataInfoToCache },
    { ...dataPaymentMethodsToCache },
  ]);
  Logger.log('DONE!');

  return { message };
}
