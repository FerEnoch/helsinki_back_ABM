import { firestoreAccessToken } from '../config/access-tokens';
import { DATABASE_FOLDERS, FIREBASE } from '../config/firebase-api';

export function firestoreCreateFile({
  id,
  category,
  type,
  name,
  description,
  imageURL,
  imageID,
  destillery,
  alcohol,
  stock,
  price,
}) {
  const {
    FIRESTORE: { COMPLETE_URL },
  } = FIREBASE;
  const firestoreURL = COMPLETE_URL(DATABASE_FOLDERS.PRODUCTS);

  return UrlFetchApp.fetch(firestoreURL, {
    method: 'POST',
    muteHttpExceptions: true,
    payload: JSON.stringify({
      fields: {
        id: { stringValue: id },
        category: { stringValue: category },
        type: { stringValue: type },
        name: { stringValue: name },
        description: { stringValue: description },
        imageURL: { stringValue: imageURL },
        imageID: { stringValue: imageID },
        destillery: { stringValue: destillery },
        alcohol: { stringValue: alcohol.toString() || `${alcohol}` },
        stock: { booleanValue: stock },
        price: { stringValue: price.toString() || `${price}` },
      },
    }),
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${firestoreAccessToken}`,
    },
  });
}
