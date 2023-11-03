import { storageAccessToken } from '../config/access-tokens';
import { DATABASE_FOLDERS, FIREBASE } from '../config/firebase-api';

export function storageCreateFile(IMAGE_FILE_ID) {
  const {
    STORAGE: { COMPLETE_URL },
  } = FIREBASE;
  const storageURL = COMPLETE_URL(DATABASE_FOLDERS.IMAGES);

  const file = DriveApp.getFileById(IMAGE_FILE_ID);
  const blob = file.getBlob();
  const bytes = blob.getBytes();

  return UrlFetchApp.fetch(`${storageURL}/${file.getId()}`, {
    method: 'POST',
    muteHttpExceptions: true,
    contentLength: bytes.length,
    contentType: blob.getContentType(),
    payload: bytes,
    headers: {
      Authorization: `Bearer ${storageAccessToken}`,
    },
  });
}
