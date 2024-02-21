import { getStorageService } from './getStorageService';

const firestoreService = getStorageService('FirebaseFirestore');
export const firestoreAccessToken = firestoreService.getAccessToken();

const storageService = getStorageService('FirestoreStorage');
export const storageAccessToken = storageService.getAccessToken();
