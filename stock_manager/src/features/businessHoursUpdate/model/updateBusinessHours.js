import { getCacheSheetData, overwriteCacheSheetData } from '../../../entities/cache';
import { SPREADSHEET } from '../../../entities/sheetData/config/spreadsheet';
import { DATABASE_API_ACTIONS, WEB_APP_CACHE_UPDATE } from '../../../shared/api';
import { DATABASE_OPERATIONS } from '../../../shared/api/config/database-operations';
import { DATABASE_FOLDERS } from '../../../shared/api/config/firebase-api';
import { getBusinessHours } from './getBusinessHours';

export async function updateBusinessHours() {
  const {
    STOCK_SPREADSHEET_ID,
    CACHE_SPREADSHEET_ID,
    BUSINESS_HOURS: hoursGridSheet,
    BUSINESS_HOURS_CACHE,
  } = SPREADSHEET;
  const { CREATE, UPDATE } = DATABASE_OPERATIONS;
  const {
    CORPORATIVE_INFO: { UPDATE: updateWebApp },
  } = WEB_APP_CACHE_UPDATE;
  const { BUSINESS_HOURS: businessHoursFolder } = DATABASE_FOLDERS;

  let message = 'success';

  const mainSpreadsheet = SpreadsheetApp.openById(STOCK_SPREADSHEET_ID);
  const businessHoursSheet = mainSpreadsheet.getSheetByName(hoursGridSheet);
  const compiledBusinessHours = getBusinessHours({ sheet: businessHoursSheet });

  if (!Object.values(compiledBusinessHours).length) {
    message = 'Unable to build business hours data ...';
    throw new Error(message);
  }

  const firestoreBusinessHoursDoc = {
    folder: businessHoursFolder,
    docLabel: businessHoursFolder,
    data: compiledBusinessHours,
  };

  let businessHoursToCache;
  const cacheSheetData = await getCacheSheetData(CACHE_SPREADSHEET_ID, BUSINESS_HOURS_CACHE);

  try {
    if (!cacheSheetData.length) {
      Logger.log(`CACHE IS EMPTY --> creating firestore doc: business-hours`);
      businessHoursToCache = DATABASE_API_ACTIONS[CREATE](firestoreBusinessHoursDoc);
      Logger.log(`Adding business-hours to cache sheet`);
    } else {
      Logger.log(`FOUND CACHE BUSINESS-HOURS --> Updating Firebase and overwriting cache anyway.`);

      const [businessHoursCache] = cacheSheetData;

      const businessHoursToUpdate = {
        folder: businessHoursFolder,
        docLabel: businessHoursFolder,
        firestoneNameID: businessHoursCache['firestoreName-ID'],
        data: compiledBusinessHours,
      };
      businessHoursToCache = DATABASE_API_ACTIONS[UPDATE](businessHoursToUpdate);

      try {
        Logger.log(`Updating web app BUSINESS HOURS cache --> ${businessHoursFolder}`);
        // Web app api route is always -->  businessHoursFolder ==> 'businessHours'
        const { message: responseMessage, code } = updateWebApp({ label: 'businessHours' });
        Logger.log(`${responseMessage} - Response status: ${code}`);
      } catch (err) {
        console.error('*****/***** Could not connect with server..'); // eslint-disable-line
      }
    }

    await overwriteCacheSheetData(CACHE_SPREADSHEET_ID, BUSINESS_HOURS_CACHE, [businessHoursToCache]);
    Logger.log('DONE!');
  } catch (e) {
    message = 'failure';
    console.error(e.message); /* eslint-disable-line */
  }
  return { message };
}
