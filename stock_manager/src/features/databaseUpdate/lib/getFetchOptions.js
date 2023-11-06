import { WEB_APP_API_KEY } from '../../../shared/api/config/api-key';

export function getFetchOptions(method, data) {
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
