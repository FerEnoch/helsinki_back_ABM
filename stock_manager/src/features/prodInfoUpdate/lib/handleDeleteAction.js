import { DATABASE_OPERATIONS } from '../../../shared/api/config/database-operations';
import { deleteFirestoreDocs } from '../../../shared/api/lib/deleteFirestoreDocs';
import { cacheOpResults } from './cacheOpResults';
import { getDeletePosibilities } from './getDeletePosibilities';
import { updateCategories } from './updateCategories';

export async function handleDeleteAction(modifiedCategories) {
  const { DELETE } = DATABASE_OPERATIONS;
  // let categoriesToCache = [];
  const { catWithLessProds, catEnterelyDeleted } = await getDeletePosibilities([...modifiedCategories]);

  if (catWithLessProds.length > 0) {
    // se borra un producto dentro de una categoría
    catWithLessProds.forEach((modCategory) => {
      Logger.log(`Se han eliminado productos de la categoría ${modCategory}`);
    });
    const result = await updateCategories([...modifiedCategories]);
    // result.forEach((updatedCat) => categoriesToCache.push(updatedCat));
    Logger.log('Caching categories with DELETE action: left category with less prods...');
    await cacheOpResults([...result]);
  }

  if (catEnterelyDeleted.length > 0) {
    // se borra una categoría entera
    catEnterelyDeleted.forEach(({ category, firestoreID }) => {
      Logger.log(`Se ha eliminado la categoría: ${category} - ID: ${firestoreID}`);
      // categoriesToCache = categoriesToCache.filter((modCat) => modCat['firestoreName-ID'] !== firestoreID);
    });
    // delete from firebase => firestoreID
    deleteFirestoreDocs([...catEnterelyDeleted]);
    Logger.log('Caching categories with DELETE action: delete category...');
    await cacheOpResults([...catEnterelyDeleted], DELETE);
  }

  // return categoriesToCache.flat();
}
