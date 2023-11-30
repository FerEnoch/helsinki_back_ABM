import { storageAccessToken } from '../config/access-tokens';
import { DATABASE_FOLDERS, FIREBASE } from '../config/firebase-api';

export function getStorageFileMetadataByName(name) {
  const {
    STORAGE: { METADATA_URL },
  } = FIREBASE;
  const storageURL = METADATA_URL(DATABASE_FOLDERS.IMAGES, name);

  return UrlFetchApp.fetch(storageURL, {
    method: 'GET',
    muteHttpExceptions: true,
    headers: {
      Authorization: `Bearer ${storageAccessToken}`,
    },
  });
}
