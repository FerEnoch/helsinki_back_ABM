import { firestoreAccessToken } from '../config/access-tokens';
import { ERROR_MESSAGES, FIREBASE } from '../config/firebase-api';
import { handleImagesStorage } from './handleImagesStorage';

export function updateFirestoreDocument({ folder, firestoneNameID, docLabel, data: compiledData = [] }) {
  const {
    FIRESTORE: { COMPLETE_URL, RESOURCE_PATH },
  } = FIREBASE;
  const firestoreURL = COMPLETE_URL(folder);
  const completeResourcePath = RESOURCE_PATH(folder);
  let updatedValueToCache;

  try {
    const resourceNamePath = `${completeResourcePath}/`;
    const firestoreResponse = UrlFetchApp.fetch(`${firestoreURL}/${firestoneNameID}`, {
      method: 'PATCH',
      muteHttpExceptions: true,
      payload: JSON.stringify({
        fields: {
          [docLabel]: { stringValue: JSON.stringify(compiledData) },
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
      const docID = name.slice(resourceNamePath.length);
      updatedValueToCache = {
        'firestoreName-ID': docID,
        firestoreName: name,
        data: JSON.stringify(compiledData),
      };
      Logger.log(`DOCUMENT UPDATED: ${docID}`);
      handleImagesStorage(compiledData);
    } else if (statusCode === 429) {
      throw new Error(ERROR_MESSAGES.CUOTA_EXCEEDED, { cause: 429 });
    } else {
      Logger.log(`Failed to update document ${docLabel}. Status code: ${statusCode}`);
    }
  } catch (e) {
    console.error(`Something happened... some products were NOT UPDATED successfully.`, e.message); /* eslint-disable-line */
    return updatedValueToCache;
  }
  return updatedValueToCache;
}
