import { DATABASE_API_ACTIONS } from '../../../shared/api';
import { DATABASE_OPERATIONS } from '../../../shared/api/config/database-operations';
import { checkExecutionTime } from '../config.js/checkExecutionTime';

export function createFirestoreDocs({ documents, collection }) {
  const { CREATE } = DATABASE_OPERATIONS;
  const categoriesToCache = [];

  documents.forEach(([category, prods]) => {
    if (checkExecutionTime()) throw new Error('retry', { cause: 408 });

    Logger.log(`Creating firestore category: ${category}`);
    const firestoreProductsDocument = {
      folder: collection,
      docLabel: category,
      data: [...prods],
    };

    const returnedInfo = DATABASE_API_ACTIONS[CREATE](firestoreProductsDocument);
    categoriesToCache.push({
      category,
      ...returnedInfo,
    });
  });

  return categoriesToCache;
}
