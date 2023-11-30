import { firestoreAccessToken } from '../config/access-tokens';
import { ERROR_MESSAGES, FIREBASE } from '../config/firebase-api';
import { handleImagesStorage } from './handleImagesStorage';

export function createFirestoreDocument({ folder, docLabel, data: compiledData = [] }) {
  const {
    FIRESTORE: { COMPLETE_URL, RESOURCE_PATH },
  } = FIREBASE;
  const firestoreURL = COMPLETE_URL(folder);
  const completeResourcePath = RESOURCE_PATH(folder);
  let createdDataToCache;

  try {
    /** Create firestore document */
    const firestoreResponse = UrlFetchApp.fetch(firestoreURL, {
      method: 'POST',
      muteHttpExceptions: true,
      payload: JSON.stringify({
        fields: {
          [docLabel]: { stringValue: JSON.stringify([...compiledData]) },
        },
      }),
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${firestoreAccessToken}`,
      },
    });

    const statusCode = firestoreResponse.getResponseCode();
    if (statusCode === 200) {
      const { name } = JSON.parse(firestoreResponse.getContentText());
      const resourceNamePath = `${completeResourcePath}/`;
      const docID = name.slice(resourceNamePath.length);
      createdDataToCache = {
        'firestoreName-ID': docID,
        firestoreName: name,
        data: JSON.stringify([...compiledData]),
      };
      Logger.log(`FILE CREATED: ${docID}`);

      handleImagesStorage(compiledData);
    } else if (statusCode === 429) {
      throw new Error(ERROR_MESSAGES.CUOTA_EXCEEDED, { cause: 429 });
    } else {
      Logger.log(`
      Failed to create document from file ${compiledData}. 
      Status code: ${statusCode}
      `);
    }
  } catch (e) {
    console.error(`Something happened uploading product info or images to storage...`, e.message); /* eslint-disable-line */
    return createdDataToCache;
  }
  return createdDataToCache;
}
