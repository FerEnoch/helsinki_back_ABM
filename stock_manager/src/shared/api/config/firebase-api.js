import { BUCKET_NAME, SERVICE_ACCOUNT } from './service-account';

const FIRESTORE_API = 'https://firestore.googleapis.com/v1beta1';
const DATABASE_PATH = `projects/${SERVICE_ACCOUNT.project_id}`;

const STORAGE_API = `https://www.googleapis.com/upload/storage/v1/b`;
const STORAGE_METADATA = `https://firebasestorage.googleapis.com/v0/b`;
const STORAGE_BUCKET_NAME = BUCKET_NAME;
const QUERY = 'o?uploadType=media&name=';

export const DATABASE_FOLDERS = {
  PRODUCTS: 'products',
  PRODUCTS_BY_CATEGORIES: 'products-categories',
  INFO: 'info',
  PAYMENT_METHODS: 'paymentMethods',
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

export const ERROR_MESSAGES = {
  GENERIC: `😕 La aplicación no se pudo actualizar totalmente porque ocurrió algún problema...`,
  CUOTA_EXCEEDED: `
  ERROR CATASTROFICO 😭
  Se ha excedido la cuota de la base de datos... La aplicación quedará desactualizada hasta el final del día... 🙇
  Intentar seguir con las actualizaciones mañana.
  `,
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
