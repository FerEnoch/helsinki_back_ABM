// import { ERROR_MESSAGES } from '../../../shared/api/config/firebase-api';
// import { firestoreDeleteDoc } from '../../../shared/api/model/firestoreDeleteDoc';

// /**
//  * Deletes firebase firestore documents (NOT their corresponding images files in storage)
//  * @param {Array} products Documents to delete from firebase database
//  * @returns {void}
//  */
// export function firebaseDatabaseDeleteFiles(products = []) {
//   if (!products.length) return Logger.log('NO PRODUCTS TO DELETE FROM FIREBASE');
//   try {
//     products.forEach((product) => {
//       const firebaseResponse = firestoreDeleteDoc(product['firestoreName-ID']);
//       const statusCode = firebaseResponse.getResponseCode();

//       if (statusCode === 200) {
//         Logger.log('Product deleted successfully.');
//       } else if (statusCode === 429) {
//         throw new Error(ERROR_MESSAGES.CUOTA_EXCEEDED, { cause: 429 });
//       } else {
//         Logger.log(`Failed to delete document. Status code:${statusCode}`);
//       }
//     });
//     // Don't return a Logger.log because it is an actual return value (logger instance) and
//     // is gives an error (although catched) in the controller function
//     return console.log(`${products.length} PRODUCTS DELETED FROM FIREBASE`); /* eslint-disable-line */
//   } catch (e) {
//     return console.error(`Something happened... firestore NOT CLEARED completely.`, e.message); /* eslint-disable-line */
//   }
// }
