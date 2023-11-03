import { INITIAL_URL_FRAGMENTS } from '../../../entities/sheetData/config/spreadsheet';
import { firestoreAccessToken } from '../config/access-tokens';
import { ERROR_MESSAGES, FIREBASE } from '../config/firebase-api';
import { storageCreateFile } from '../model/storageCreateFile';

export function updateFirestoreDocument({ folder, firestoneNameID, docLabel, data = [] }) {
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
          [docLabel]: { stringValue: JSON.stringify(data) },
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
        data: JSON.stringify(data),
      };
      Logger.log(`FILE UPDATED: ${docID}`);

      /**  Only upload images for files that have Its image ID  */
      const [paymentQRMethod] = INITIAL_URL_FRAGMENTS.map((fragment) => {
        return data.filter((dataObj) => dataObj?.cbu_or_link?.includes(fragment));
      })
        .filter((result) => result.length)
        .flat();
      if (paymentQRMethod) {
        const storageResponse = storageCreateFile(paymentQRMethod?.imageID);
        const storageStatusCode = storageResponse.getResponseCode();
        if (storageStatusCode === 200) {
          const { name: storageFileName } = JSON.parse(storageResponse.getContentText());
          Logger.log(`IMAGE FILE UPDATED: ${storageFileName}`);
        } else {
          Logger.log(`Failed to update image document from file ${data}. Status code: ${statusCode}`);
        }
      }
    } else if (statusCode === 429) {
      throw new Error(ERROR_MESSAGES.CUOTA_EXCEEDED, { cause: 429 });
    } else {
      Logger.log(`Failed to update document from file ${data}. Status code: ${statusCode}`);
    }
  } catch (e) {
    console.error(`Something happened... some products were NOT UPDATED successfully.`, e.message); /* eslint-disable-line */
    return updatedValueToCache;
  }
  return updatedValueToCache;
}
