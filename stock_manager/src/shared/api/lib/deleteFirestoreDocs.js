import { checkExecutionTime } from '../../../features/prodInfoUpdate/config.js/checkExecutionTime';
import { ERROR_MESSAGES } from '../config/firebase-api';
import { firestoreDeleteDoc } from '../model/firestoreDeleteDoc';

export function deleteFirestoreDocs({ documents = [], collection }) {
  if (!documents.length) return Logger.log('NO DOCS TO DELETE FROM FIRESTORE');

  try {
    documents.forEach((doc) => {
      if (checkExecutionTime()) throw new Error('retry', { cause: 408 });

      const docFirestoreID = doc['firestoreName-ID'];
      if (!docFirestoreID) return;

      const firebaseResponse = firestoreDeleteDoc(docFirestoreID, collection);
      const statusCode = firebaseResponse.getResponseCode();

      if (statusCode === 200) {
        Logger.log(`Document deleted successfully -> ID: ${docFirestoreID}`);
      } else if (statusCode === 429) {
        throw new Error(ERROR_MESSAGES.CUOTA_EXCEEDED, { cause: 429 });
      } else {
        Logger.log(`Failed to delete document. Status code:${statusCode}`);
      }
    });
    // Don't return a Logger.log because it is an actual return value (logger instance) and
    // is gives an error (although catched)
    return console.log(`${documents.length} DOCS DELETED FROM FIRESTORE`); /* eslint-disable-line */
  } catch (e) {
    if (e.cause === 408) throw e;
    return console.error(`Something happened... firestore doc NOT DELETED properly.`, e.message); /* eslint-disable-line */
  }
}
