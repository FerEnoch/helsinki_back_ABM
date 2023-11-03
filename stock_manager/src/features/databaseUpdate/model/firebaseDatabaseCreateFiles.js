import { DATABASE_FOLDERS, ERROR_MESSAGES, FIREBASE } from '../../../shared/api/config/firebase-api';
import { firestoreCreateFile } from '../../../shared/api/model/firestoreCreateFile';
import { storageCreateFile } from '../../../shared/api/model/storageCreateFile';

/**
 * Creates firebase firestore documents and their corresponding images files in storage
 * @param {Array} files Products to upload to firebase database
 * @returns {Promise<Array>} Formatted files to save in cache sheet
 */
export function firebaseDatabaseCreateFiles(files = []) {
  if (!files.length) return Logger.log('NO PRODUCTS TO CREATE IN FIREBASE');

  const {
    FIRESTORE: { RESOURCE_PATH },
  } = FIREBASE;
  const completeResourcePath = RESOURCE_PATH(DATABASE_FOLDERS.PRODUCTS);

  const createdFiles = [];
  try {
    files.forEach((file) => {
      if (!file) return;
      /** Create firestore documents */
      const firestoreResponse = firestoreCreateFile(file);
      const statusCode = firestoreResponse.getResponseCode();
      if (statusCode === 200) {
        const { name } = JSON.parse(firestoreResponse.getContentText());
        const resourceNamePath = `${completeResourcePath}/`;
        const docID = name.slice(resourceNamePath.length);
        const dataToCache = {
          'firestoreName-ID': docID,
          firestoreName: name,
          ...file,
        };
        createdFiles.push(dataToCache);
        Logger.log(`FILE CREATED: ${docID} --> ${file.id}`);
        /**  Only upload images for files that have Its image ID  */
        if (file.imageID) {
          storageCreateFile(file.imageID);
        }
      } else if (statusCode === 429) {
        throw new Error(ERROR_MESSAGES.CUOTA_EXCEEDED, { cause: 429 });
      } else {
        Logger.log(`Failed to create document from file ${file.id}. Status code: ${statusCode}`);
      }
    });
  } catch (e) {
    console.error(`Something happened uploading product info or images to storage...`, e.message); /* eslint-disable-line */
    return createdFiles;
  }
  return createdFiles;
}
