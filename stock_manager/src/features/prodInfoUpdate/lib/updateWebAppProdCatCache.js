import { getWebAppApiProdCatRoute } from '../../databaseUpdate/config/api';
import { getFetchOptions } from '../../databaseUpdate/lib/getFetchOptions';

export function updateWebAppProdCatCache({ action, label, content }) {
  const response = UrlFetchApp.fetch(getWebAppApiProdCatRoute(label), getFetchOptions(action, content));
  const { message } = JSON.parse(response.getContentText());
  return {
    message,
    code: response.getResponseCode(),
  };
}
