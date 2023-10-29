import { WEB_APP_API_KEY } from '../../../shared/api/config/api-key';
import { WEB_APP_URL } from '../config/api';

function getFetchOptions(method, data) {
  return {
    method,
    muteHttpExceptions: true,
    contentType: 'application/json',
    payload: JSON.stringify(data),
    headers: {
      'x-api-key': WEB_APP_API_KEY,
    },
  };
}

export function addProductsToWebAppCache(products) {
  Logger.log(`Updating web app: ${products.length} products to ADD`);
  const firebaseIDs = products.map((prod) => prod.id);
  const response = UrlFetchApp.fetch(WEB_APP_URL, getFetchOptions('PUT', [...firebaseIDs]));
  const { message } = JSON.parse(response.getContentText());
  return {
    message,
    code: response.getResponseCode(),
  };
}

export function updateProductsInWebAppCache(products) {
  Logger.log(`Updating web app: ${products.length} products to UPDATE`);
  const firebaseIDs = products.map((prod) => prod['firestoreName-ID']);
  const response = UrlFetchApp.fetch(WEB_APP_URL, getFetchOptions('PATCH', [...firebaseIDs]));
  const { message } = JSON.parse(response.getContentText());
  return {
    message,
    code: response.getResponseCode(),
  };
}

export function deleteProductsInWebAppCache(products) {
  Logger.log(`Updating web app: ${products.length} products to DELETE`);
  const productIDs = products.map((prod) => prod.id);
  const response = UrlFetchApp.fetch(WEB_APP_URL, getFetchOptions('DELETE', [...productIDs]));
  const { message } = JSON.parse(response.getContentText());
  return {
    message,
    code: response.getResponseCode(),
  };
}
