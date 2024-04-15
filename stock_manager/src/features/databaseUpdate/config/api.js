// import { WEB_APP_API_KEY } from '../../../shared/api/config/api-key';

const devMode = process.env.NODE_ENV === 'development';
const stagingMode = process.env.STAGING;

// export const withAuthAPIOptionsObj = {
//   headers: {
//     'content-type': 'application/json',
//     'x-api-key': WEB_APP_API_KEY,
//   },
// };

export const LOCAL_PRODUCTION_URL = 'https://sjq5dd8h-3000.brs.devtunnels.ms';
export const HOSTING_TESTING_URL = 'https://helsinki-delivery-web-app-git-prod-testing-ferenoch.vercel.app';
const HOSTING_URL = 'https://www.helsinkidelivery.com.ar';

const prodModesURLs = stagingMode ? HOSTING_TESTING_URL : HOSTING_URL;

export const PRODUCTION_URL = devMode ? LOCAL_PRODUCTION_URL : prodModesURLs;

export function getWebAppApiProdCatRoute(path) {
  return `${PRODUCTION_URL}/api/products/${path || ''}`;
}

export function getWebAppApiInfoRoute(path) {
  return `${PRODUCTION_URL}/api/${path || ''}`;
}
