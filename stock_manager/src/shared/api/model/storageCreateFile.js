import { storageAccessToken } from '../config/access-tokens';
import { STORAGE_URL } from '../config/firebase-api';

export function storageCreateFile(IMAGE_FILE_ID) {
  const file = DriveApp.getFileById(IMAGE_FILE_ID);
  const blob = file.getBlob();
  const bytes = blob.getBytes();

  return UrlFetchApp.fetch(`${STORAGE_URL}/${file.getId()}`, {
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
