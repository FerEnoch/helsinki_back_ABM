import { firestoreAccessToken } from '../config/access-tokens';
import { DATABASE_FOLDERS, FIREBASE } from '../config/firebase-api';

export function firestoreDeleteDoc(docFirestoreID) {
  const {
    FIRESTORE: { COMPLETE_URL },
  } = FIREBASE;
  const firestoreURL = COMPLETE_URL(DATABASE_FOLDERS.PRODUCTS);

  return UrlFetchApp.fetch(`${firestoreURL}/${docFirestoreID}`, {
    method: 'DELETE',
    muteHttpExceptions: true,
    headers: {
      Authorization: `Bearer ${firestoreAccessToken}`,
    },
  });
}
