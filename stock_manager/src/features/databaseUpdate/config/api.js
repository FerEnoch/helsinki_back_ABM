import { WEB_APP_API_KEY } from '../../../shared/api/config/api-key';

export const withAuthAPIOptionsObj = {
  headers: {
    'content-type': 'application/json',
    'x-api-key': WEB_APP_API_KEY,
  },
};

// const LOCAL_PRODUCTION_URL = 'https://sjq5dd8h-3000.brs.devtunnels.ms';
// const PROD_TESTING_URL = 'https://helsinki-delivery-web-app-git-prod-testing-ferenoch.vercel.app';
export const PRODUCTION_URL = 'https://www.helsinkidelivery.com.ar';

export const WEB_APP_PRODUCTS_UPDATES_URL = `${PRODUCTION_URL}/api/products/updates`;

export function getWebAppApiProdCatRoute(path) {
  return `${PRODUCTION_URL}/api/products/${path || ''}`;
}

export function getWebAppApiInfoRoute(path) {
  return `${PRODUCTION_URL}/api/${path || ''}`;
}
