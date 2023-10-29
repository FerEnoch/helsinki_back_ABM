import { SERVICE_ACCOUNT } from './service-account';

const FIRESTORE_API = 'https://firestore.googleapis.com/v1beta1';
const PRODUCTS_DATABASE_FOLDER = 'products';
const DATABASE_PATH = `projects/${SERVICE_ACCOUNT.project_id}`;
export const COMPLETE_RESOURCE_PATH = `${DATABASE_PATH}/databases/(default)/documents/${encodeURIComponent(
  PRODUCTS_DATABASE_FOLDER
)}`;
// projects/stock-backend-123456789/databases/(default)/documents/products/
export const FIRESTORE_URL = `${FIRESTORE_API}/${COMPLETE_RESOURCE_PATH}`;

const STORAGE_API = `https://www.googleapis.com/upload/storage/v1/b`;
const STORAGE_BUCKET_NAME = 'stock-backend-392114.appspot.com';
const IMAGES_FOLDER = 'products_images';
const QUERY = `o?uploadType=media&name=${encodeURIComponent(IMAGES_FOLDER)}`;
export const STORAGE_URL = `${STORAGE_API}/${STORAGE_BUCKET_NAME}/${QUERY}`;

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
