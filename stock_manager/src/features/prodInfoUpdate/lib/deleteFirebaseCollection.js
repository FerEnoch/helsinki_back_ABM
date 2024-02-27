import { deleteFirestoreDocs } from '../../../shared/api/lib/deleteFirestoreDocs';
// import { firebaseDatabaseDeleteFiles } from './firebaseDatabaseDeleteFiles';
import { getFirestoreDocsList } from './getFirestoreCurrentDocs';

export async function deleteFirebaseCollection({ collection }) {
  const currentFirestoreCategories = getFirestoreDocsList(collection);
  // firebaseDatabaseDeleteFiles(currentFirestoreCategories);
  await deleteFirestoreDocs({ documents: currentFirestoreCategories, collection });
}
