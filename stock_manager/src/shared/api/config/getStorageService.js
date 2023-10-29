import { SERVICE_ACCOUNT } from './service-account';

export function getStorageService(service) {
  return OAuth2.createService(service)
    .setPrivateKey(SERVICE_ACCOUNT.private_key)
    .setIssuer(SERVICE_ACCOUNT.client_email)
    .setPropertyStore(PropertiesService.getUserProperties())
    .setCache(CacheService.getUserCache())
    .setTokenUrl(SERVICE_ACCOUNT.token_uri)
    .setScope([
      'https://www.googleapis.com/auth/datastore',
      'https://www.googleapis.com/auth/devstorage.read_write',
      'https://www.googleapis.com/auth/cloud-platform',
    ]);
}
