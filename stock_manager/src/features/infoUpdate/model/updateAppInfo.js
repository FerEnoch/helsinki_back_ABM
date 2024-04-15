import { getCacheSheetData, overwriteCacheSheetData } from '../../../entities/cache';
import { COLUMN_HEADERS, SPREADSHEET } from '../../../entities/sheetData/config/spreadsheet';
import { fetchSheetData } from '../../../entities/sheetData/lib/fetchSheetData';
import { DATABASE_API_ACTIONS, WEB_APP_CACHE_UPDATE } from '../../../shared/api';
import { DATABASE_OPERATIONS } from '../../../shared/api/config/database-operations';
import { DATABASE_FOLDERS } from '../../../shared/api/config/firebase-api';
import { buildHelsinkiInfoContent } from '../lib/buildHelsinkiInfoContent';

export async function updateAppInfo() {
  const { STOCK_SPREADSHEET_ID, INFO, FAQ, ACCOUNT, CACHE_SPREADSHEET_ID, INFO_CACHE } = SPREADSHEET;
  const { MAIN_SHEET_INFO: informationHeaders, MAIN_SHEET_ACCOUNT: accountHeaders } = COLUMN_HEADERS;
  const { CREATE, UPDATE } = DATABASE_OPERATIONS;
  const {
    CORPORATIVE_INFO: { UPDATE: updateWebApp },
  } = WEB_APP_CACHE_UPDATE;
  const { INFO: infoFolder, PAYMENT_METHODS: paymentMethodsFolder, FAQ: faqFolder } = DATABASE_FOLDERS;

  let message = 'success';

  const { rawData: helsinkiInfo } = await fetchSheetData(STOCK_SPREADSHEET_ID, INFO, informationHeaders);
  const { rawData: helsinkiAccount } = await fetchSheetData(STOCK_SPREADSHEET_ID, ACCOUNT, accountHeaders);
  const { rawData: helsinkiFaq } = await fetchSheetData(STOCK_SPREADSHEET_ID, FAQ);

  const [compiledInfo, compiledFaq, ...compiledMPaymentMethods] = buildHelsinkiInfoContent(
    helsinkiInfo,
    helsinkiAccount,
    helsinkiFaq
  );

  if (!compiledMPaymentMethods.length) {
    message = 'Unable to build account data to update firestore database';
    throw new Error(message);
  }

  const firestoreInfoDocument = {
    folder: infoFolder,
    docLabel: infoFolder,
    data: [compiledInfo],
  };

  const firestoreFaqDocument = {
    folder: faqFolder,
    docLabel: faqFolder,
    data: [compiledFaq],
  };

  const firestorePaymentMethodsDocument = {
    folder: paymentMethodsFolder,
    docLabel: paymentMethodsFolder,
    data: [compiledMPaymentMethods],
  };

  let dataInfoToCache;
  let dataPaymentMethodsToCache;
  let dataFaqToCache;
  const cacheSheetData = await getCacheSheetData(CACHE_SPREADSHEET_ID, INFO_CACHE);

  try {
    if (!cacheSheetData.length) {
      Logger.log(`CACHE IS EMPTY --> creating firestore docs: info, faq and paymentMethods`);
      dataInfoToCache = DATABASE_API_ACTIONS[CREATE](firestoreInfoDocument);
      dataFaqToCache = DATABASE_API_ACTIONS[CREATE](firestoreFaqDocument);
      dataPaymentMethodsToCache = DATABASE_API_ACTIONS[CREATE](firestorePaymentMethodsDocument);
      Logger.log(`Adding info, faq and paymentMethods as INFO to cache sheet`);

      // [infoFolder, faqFolder, paymentMethodsFolder].forEach((updatingFolder) => {
      //   Logger.log(`Updating web app CORPORATIVE INFO cache --> ${updatingFolder}`);
      //   const { message: responseMessage, code } = updateWebApp({ label: updatingFolder });
      //   Logger.log(`${responseMessage} - Response status: ${code}`);
      // });
    } else {
      Logger.log(`FOUND CACHE INFO --> Updating Firebase and overwriting info sheet anyway.`);

      const [info, paymentMethods, faq] = cacheSheetData;

      const infoToUpdate = {
        folder: infoFolder,
        docLabel: infoFolder,
        firestoneNameID: info['firestoreName-ID'],
        data: [compiledInfo],
      };
      dataInfoToCache = DATABASE_API_ACTIONS[UPDATE](infoToUpdate);

      const faqToUpdate = {
        folder: faqFolder,
        docLabel: faqFolder,
        firestoneNameID: faq['firestoreName-ID'],
        data: [compiledFaq],
      };
      dataFaqToCache = DATABASE_API_ACTIONS[UPDATE](faqToUpdate);

      const paymentMethodsToUpdate = {
        folder: paymentMethodsFolder,
        docLabel: paymentMethodsFolder,
        firestoneNameID: paymentMethods['firestoreName-ID'],
        data: [compiledMPaymentMethods],
      };
      dataPaymentMethodsToCache = DATABASE_API_ACTIONS[UPDATE](paymentMethodsToUpdate);

      [infoFolder, faqFolder, paymentMethodsFolder].forEach((updatingFolder) => {
        Logger.log(`Updating web app CORPORATIVE INFO cache --> ${updatingFolder}`);
        const { message: responseMessage, code } = updateWebApp({ label: updatingFolder });
        Logger.log(`${responseMessage} - Response status: ${code}`);
      });
    }

    await overwriteCacheSheetData(CACHE_SPREADSHEET_ID, INFO_CACHE, [
      dataInfoToCache,
      dataPaymentMethodsToCache,
      dataFaqToCache,
    ]);
    Logger.log('DONE!');
  } catch (e) {
    message = 'failure';
    console.error(e.message);/* eslint-disable-line */
  }
  return { message };
}
