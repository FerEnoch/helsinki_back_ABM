import { getWebAppApiProdCatRoute } from '../../databaseUpdate/config/api';
import { getFetchOptions } from '../../databaseUpdate/lib/getFetchOptions';

export async function updateWebAppProdCatCache({ action, path, content }) {
  const response = UrlFetchApp.fetch(getWebAppApiProdCatRoute(path), getFetchOptions(action, content));
  const { message } = JSON.parse(response.getContentText());
  return {
    message,
    code: response.getResponseCode(),
  };
}
