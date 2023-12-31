import { DATABASE_OPERATIONS } from './config/database-operations';
import { updateCorporativeInfoInWebAppCache } from '../../features/databaseUpdate/model/updateCorporativeInfoWebAppCache';
import { createFirestoreDocument } from './lib/createFirestoreDocument';
import { updateFirestoreDocument } from './lib/updateFirestoreDocument';

const {
  // LEAVE,
  CREATE,
  UPDATE,
  // DELETE
} = DATABASE_OPERATIONS;

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
