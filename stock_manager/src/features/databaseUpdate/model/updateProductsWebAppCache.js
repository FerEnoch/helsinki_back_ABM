import { WEB_APP_PRODUCTS_UPDATES_URL } from '../config/api';
import { getFetchOptions } from '../lib/getFetchOptions';

export function addProductsToWebAppCache(products) {
  Logger.log(`Updating web app: ${products.length} products to ADD`);
  const firebaseIDs = products.map((prod) => prod.id);
  const response = UrlFetchApp.fetch(WEB_APP_PRODUCTS_UPDATES_URL, getFetchOptions('PUT', [...firebaseIDs]));
  const { message } = JSON.parse(response.getContentText());
  return {
    message,
    code: response.getResponseCode(),
  };
}

export function updateProductsInWebAppCache(products) {
  Logger.log(`Updating web app: ${products.length} products to UPDATE`);
  const firebaseIDs = products.map((prod) => prod['firestoreName-ID']);
  const response = UrlFetchApp.fetch(WEB_APP_PRODUCTS_UPDATES_URL, getFetchOptions('PATCH', [...firebaseIDs]));
  const { message } = JSON.parse(response.getContentText());
  return {
    message,
    code: response.getResponseCode(),
  };
}

export function deleteProductsInWebAppCache(products) {
  Logger.log(`Updating web app: ${products.length} products to DELETE`);
  const productIDs = products.map((prod) => prod.id);
  const response = UrlFetchApp.fetch(WEB_APP_PRODUCTS_UPDATES_URL, getFetchOptions('DELETE', [...productIDs]));
  const { message } = JSON.parse(response.getContentText());
  return {
    message,
    code: response.getResponseCode(),
  };
}
