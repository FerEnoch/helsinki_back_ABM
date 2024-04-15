import { BUCKET_NAME, SERVICE_ACCOUNT } from './service-account';

const FIRESTORE_API = 'https://firestore.googleapis.com/v1beta1';
const DATABASE_PATH = `projects/${SERVICE_ACCOUNT.project_id}`;

const STORAGE_API = `https://www.googleapis.com/upload/storage/v1/b`;
const STORAGE_METADATA = `https://firebasestorage.googleapis.com/v0/b`;
const STORAGE_BUCKET_NAME = BUCKET_NAME;
const QUERY = 'o?uploadType=media&name=';

const devMode = process.env.NODE_ENV === 'development';

export const DATABASE_FOLDERS = {
  PRODUCTS_BY_CATEGORIES: devMode ? 'categories-test' : 'products-categories',
  PRODUCTS_COMBOS: devMode ? 'combos-test' : 'products-combos',
  BUSINESS_HOURS: devMode ? 'hoursTest' : 'businessHours',
  INFO: 'info',
  PAYMENT_METHODS: 'paymentMethods',
  FAQ: 'faq',
  IMAGES: 'images',
};

export const FIREBASE = {
  FIRESTORE: {
    COMPLETE_URL: (folder) =>
      `${FIRESTORE_API}/${DATABASE_PATH}/databases/(default)/documents/${encodeURIComponent(folder)}`,
    RESOURCE_PATH: (folder) => `${DATABASE_PATH}/databases/(default)/documents/${encodeURIComponent(folder)}`,
  },
  STORAGE: {
    COMPLETE_URL: (folder) => `${STORAGE_API}/${STORAGE_BUCKET_NAME}/${QUERY}${encodeURIComponent(folder)}`,
    METADATA_URL: (folder, fileName) =>
      `${STORAGE_METADATA}/${STORAGE_BUCKET_NAME}/o/${encodeURIComponent(`${folder}/${fileName}`)}`,
  },
};

/**
 *  OAuth2 -v43
 *  The library used to get the firebase firestore session
 *  See https://www.labnol.org/code/20074-upload-files-to-google-cloud-storage
 */
/**
 *  See appscript.json
 *  "libraries": [
 *    {
 *      "libraryId": "1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF",
 *      "userSymbol": "OAuth2",
 *      "version": "43"
 *    }
 *  ]
 */
