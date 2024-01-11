import { firestoreAccessToken } from '../config/access-tokens';
import { DATABASE_FOLDERS, FIREBASE } from '../config/firebase-api';

export function firestoreDeleteDoc(docFirestoreID, folder) {
  const {
    FIRESTORE: { COMPLETE_URL },
  } = FIREBASE;
  const documentFolder = folder || DATABASE_FOLDERS.PRODUCTS_BY_CATEGORIES;
  const firestoreURL = COMPLETE_URL(documentFolder);

  return UrlFetchApp.fetch(`${firestoreURL}/${docFirestoreID}`, {
    method: 'DELETE',
    muteHttpExceptions: true,
    headers: {
      Authorization: `Bearer ${firestoreAccessToken}`,
    },
  });
}
