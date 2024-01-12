// import { firestoreAccessToken } from '../config/access-tokens';
import { firestoreAccessToken } from '../../../shared/api/config/access-tokens';
import { ERROR_MESSAGES, FIREBASE } from '../../../shared/api/config/firebase-api';

function fetchData({ token = '', collection }) {
  const {
    FIRESTORE: { COMPLETE_URL },
  } = FIREBASE;

  const firestoreURL = COMPLETE_URL(collection);

  return UrlFetchApp.fetch(token ? `${firestoreURL}?pageToken=${token}` : firestoreURL, {
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
export function getFirestoreDocsList(collection) {
  console.log('GETING FIRESTORE DOCS...'); /* eslint-disable-line */

  const {
    FIRESTORE: { RESOURCE_PATH },
  } = FIREBASE;

  const resourcePath = RESOURCE_PATH(collection);
  const completeResourcePath = `${resourcePath}/`;
  const prodsFirestoreName = [];
  let categoriesCollection;
  let nextPageToken;
  do {
    const firestoreResponse = fetchData({ token: nextPageToken, collection });
    const statusCode = firestoreResponse.getResponseCode();
    if (statusCode === 200) {
      categoriesCollection = JSON.parse(firestoreResponse.getContentText());
      // console.log(`${nextPageToken ? 'fetching next page' : 'fetching data'}`);  /* eslint-disable-line */
      nextPageToken = categoriesCollection.nextPageToken;
      categoriesCollection?.documents?.forEach((document) => {
        const dbCurrentDocument = {
          // name: document.name,
          'firestoreName-ID': document.name.slice(completeResourcePath.length),
        };
        prodsFirestoreName.push(dbCurrentDocument);
      });
    } else if (statusCode === 429) {
      throw new Error(ERROR_MESSAGES.CUOTA_EXCEEDED, { cause: 429 });
    } else {
      console.error(`Failed to get document from firestore... Status code: ${statusCode}`); /* eslint-disable-line */
    }
  } while (categoriesCollection?.nextPageToken);
  return prodsFirestoreName;
}
