import { getStorageFileMetadataByName } from '../model/getStorageFileMetadataByName';
import { storageCreateFile } from '../model/storageCreateFile';

export function handleImagesStorage(data) {
  /**  Only upload images for files that have Its image ID  */
  const filesWithImage = data.filter((dataField) => dataField?.imageID?.length > 0).filter(Boolean);
  if (filesWithImage.length > 0) {
    filesWithImage.forEach((file) => {
      /* Only upload image of files that hasn't already got its image in storage */
      const checkImageResponse = getStorageFileMetadataByName(file.imageID);
      const isImageAlreadyInStorage = checkImageResponse.getResponseCode() === 200;
      if (isImageAlreadyInStorage) return;

      const storageResponse = storageCreateFile(file?.imageID);
      const storageStatusCode = storageResponse.getResponseCode();
      if (storageStatusCode === 200) {
        const { name: storageFileName } = JSON.parse(storageResponse.getContentText());
        Logger.log(`IMAGE FILE CREATED: ${storageFileName}`);
      } else {
        Logger.log(`Failed to create image document from file ${file}. Status code: ${storageStatusCode}`);
      }
    });
  }
}
