import { firestoreAccessToken } from '../config/access-tokens';
import { FIRESTORE_URL } from '../config/firebase-api';

export function firestoreDeleteDoc(docFirestoreID) {
  return UrlFetchApp.fetch(`${FIRESTORE_URL}/${docFirestoreID}`, {
    method: 'DELETE',
    muteHttpExceptions: true,
    headers: {
      Authorization: `Bearer ${firestoreAccessToken}`,
    },
  });
}
