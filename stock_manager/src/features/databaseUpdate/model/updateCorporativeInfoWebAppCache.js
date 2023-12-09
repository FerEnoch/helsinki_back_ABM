import { getWebAppApiInfoRoute } from '../config/api';
import { getFetchOptions } from '../lib/getFetchOptions';

export function updateCorporativeInfoInWebAppCache({ label }) {
  const response = UrlFetchApp.fetch(getWebAppApiInfoRoute(label), getFetchOptions('PATCH', label));
  const { message } = JSON.parse(response.getContentText());
  return {
    message,
    code: response.getResponseCode(),
  };
}
