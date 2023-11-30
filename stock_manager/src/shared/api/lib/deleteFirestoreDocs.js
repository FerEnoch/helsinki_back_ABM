import { DATABASE_FOLDERS, ERROR_MESSAGES } from '../config/firebase-api';
import { firestoreDeleteDoc } from '../model/firestoreDeleteDoc';

export function deleteFirestoreDocs(documents = []) {
  if (!documents.length) return Logger.log('NO DOCS TO DELETE FROM FIRESTORE');

  try {
    documents.forEach((doc) => {
      const docFirestoreID = doc.firestoreID;
      if (!docFirestoreID) return;

      const firebaseResponse = firestoreDeleteDoc(docFirestoreID, DATABASE_FOLDERS.PRODUCTS_BY_CATEGORIES);
      const statusCode = firebaseResponse.getResponseCode();

      if (statusCode === 200) {
        Logger.log('Document deleted successfully.');
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
    return console.error(`Something happened... firestore NOT CLEARED completely.`, e.message); /* eslint-disable-line */
  }
}
