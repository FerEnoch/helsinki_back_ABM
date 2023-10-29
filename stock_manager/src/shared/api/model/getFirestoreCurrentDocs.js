import { firestoreAccessToken } from '../config/access-tokens';
import { COMPLETE_RESOURCE_PATH, ERROR_MESSAGES, FIRESTORE_URL } from '../config/firebase-api';

function fetchData(nextPageToken = '') {
  return UrlFetchApp.fetch(nextPageToken ? `${FIRESTORE_URL}?pageToken=${nextPageToken}` : FIRESTORE_URL, {
    method: 'GET',
    muteHttpExceptions: true,
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${firestoreAccessToken}`,
    },
  });
}
/**
 * Fetch for firestore products
 * @returns {string[]} Returns firestore products NAME (which is an unique ID), and ID field (unique product ID)
 */
export function getFirestoreDocsList() {
  console.log('GETING FIRESTORE DOCS...'); /* eslint-disable-line */

  const completeResourcePath = `${COMPLETE_RESOURCE_PATH}/`;
  const prodsFirestoreName = [];
  let productsCollection;
  let nextPageToken;
  do {
    const firestoreResponse = fetchData(nextPageToken);
    const statusCode = firestoreResponse.getResponseCode();
    if (statusCode === 200) {
      productsCollection = JSON.parse(firestoreResponse.getContentText());
      // console.log(`${nextPageToken ? 'fetching next page' : 'fetching data'}`);  /* eslint-disable-line */
      nextPageToken = productsCollection.nextPageToken;
      productsCollection?.documents?.forEach((document) => {
        const dbCurrentDocument = {
          name: document.name,
          'firestoreName-ID': document.name.slice(completeResourcePath.length),
          id: document.fields.id.stringValue,
        };
        prodsFirestoreName.push(dbCurrentDocument);
      });
    } else if (statusCode === 429) {
      throw new Error(ERROR_MESSAGES.CUOTA_EXCEEDED, { cause: 429 });
    } else {
      console.error(`Failed to get document from firestore... Status code: ${statusCode}`); /* eslint-disable-line */
    }
  } while (productsCollection?.nextPageToken);
  return prodsFirestoreName;
}
