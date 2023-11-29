import { firebaseDatabaseCreateFiles } from '../../features/databaseUpdate/model/firebaseDatabaseCreateFiles';
import { firebaseDatabaseDeleteFiles } from '../../features/databaseUpdate/model/firebaseDatabaseDeleteFiles';
import { firebaseDatabaseUpdateFiles } from '../../features/databaseUpdate/model/firebaseDatabaseUpdateFiles';
import { updateCorporativeInfoInWebAppCache } from '../../features/databaseUpdate/model/updateCorporativeInfoWebAppCache';
import {
  addProductsToWebAppCache,
  deleteProductsInWebAppCache,
  updateProductsInWebAppCache,
} from '../../features/databaseUpdate/model/updateProductsWebAppCache';
import { DATABASE_OPERATIONS } from './config/database-operations';
import { createFirestoreDocument } from './lib/createFirestoreDocument';
import { updateFirestoreDocument } from './lib/updateFirestoreDocument';
import { noChangeDataLogger } from './model/noChangeDataLogger';

const { LEAVE, CREATE, UPDATE, DELETE } = DATABASE_OPERATIONS;

export const PRODUCTS_DATABASE_API_ACTIONS = {
  [LEAVE]: noChangeDataLogger,
  [CREATE]: firebaseDatabaseCreateFiles,
  [UPDATE]: firebaseDatabaseUpdateFiles,
  [DELETE]: firebaseDatabaseDeleteFiles,
};

export const WEB_APP_API_ACTIONS = {
  [CREATE]: addProductsToWebAppCache,
  [UPDATE]: updateProductsInWebAppCache,
  [DELETE]: deleteProductsInWebAppCache,
};

/**
 *  New version of the API
 */
export const DATABASE_API_ACTIONS = {
  [CREATE]: createFirestoreDocument,
  [UPDATE]: updateFirestoreDocument,
};

export const WEB_APP_CACHE_UPDATE = {
  CORPORATIVE_INFO: {
    [UPDATE]: updateCorporativeInfoInWebAppCache,
  },
};
