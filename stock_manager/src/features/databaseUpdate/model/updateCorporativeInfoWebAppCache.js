import { getWebAppApiRoute } from '../config/api';
import { getFetchOptions } from '../lib/getFetchOptions';

export function updateCorporativeInfoInWebAppCache({ label }) {
  Logger.log(`Updating web app CORPORATIVE INFO cache --> ${label}`);
  const response = UrlFetchApp.fetch(getWebAppApiRoute(label), getFetchOptions('PATCH', label));
  const { message } = JSON.parse(response.getContentText());
  return {
    message,
    code: response.getResponseCode(),
  };
}
