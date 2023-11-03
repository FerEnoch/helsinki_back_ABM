import { DATABASE_FOLDERS, ERROR_MESSAGES, FIREBASE } from '../../../shared/api/config/firebase-api';
import { firestoreUpdateDoc } from '../../../shared/api/model/firestoreUpdateDoc';
import { storageCreateFile } from '../../../shared/api/model/storageCreateFile';

/**
 * Updates firebase firestore documents
 * @param {Array} products Proudcts to update from firebase database
 * @returns {void}
 */
export function firebaseDatabaseUpdateFiles(products = []) {
  if (!products.length) return Logger.log('NO PRODUCTS TO UPDATE IN FIREBASE');

  const {
    FIRESTORE: { RESOURCE_PATH },
  } = FIREBASE;
  const completeResourcePath = RESOURCE_PATH(DATABASE_FOLDERS.PRODUCTS);
  const updatedFiles = [];

  try {
    products.forEach((prod) => {
      const resourceNamePath = `${completeResourcePath}/`;
      const docToUpdateFirestoreID = prod['firestoreName-ID'];
      const firestoreResponse = firestoreUpdateDoc(prod, docToUpdateFirestoreID);
      const statusCode = firestoreResponse.getResponseCode();

      if (statusCode === 200) {
        const { name } = JSON.parse(firestoreResponse.getContentText());
        const docID = name.slice(resourceNamePath.length);
        const updatedProduct = {
          'firestoreName-ID': docID,
          firestoreName: name,
          ...prod,
        };
        if (updatedProduct.imageID) {
          storageCreateFile(updatedProduct.imageID);
        }
        updatedFiles.push(updatedProduct);

        Logger.log(`FILE UPDATED: ${docID} --> ${prod.id}`);
      } else if (statusCode === 429) {
        throw new Error(ERROR_MESSAGES.CUOTA_EXCEEDED, { cause: 429 });
      } else {
        Logger.log(`Failed to update document from file ${prod.id}. Status code: ${statusCode}`);
      }
    });
  } catch (e) {
    console.error(`Something happened... some products were NOT UPDATED successfully.`, e.message); /* eslint-disable-line */
    return updatedFiles;
  }
  return updatedFiles;
}
