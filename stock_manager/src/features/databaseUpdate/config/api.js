import { WEB_APP_API_KEY } from '../../../shared/api/config/api-key';

export const withAuthAPIOptionsObj = {
  headers: {
    'content-type': 'application/json',
    'x-api-key': WEB_APP_API_KEY,
  },
};

// const PRODUCTION_URL = 'https://sjq5dd8h-3000.brs.devtunnels.ms';
const PRODUCTION_URL = 'https://helsinkidelivery.vercel.app';

export const WEB_APP_URL = `${PRODUCTION_URL}/api/products/updates`;
