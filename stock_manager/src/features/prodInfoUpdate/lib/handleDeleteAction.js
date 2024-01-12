import { DATABASE_OPERATIONS } from '../../../shared/api/config/database-operations';
import { deleteFirestoreDocs } from '../../../shared/api/lib/deleteFirestoreDocs';
import { cacheOpResults } from './cacheOpResults';
import { getDeletePosibilities } from './getDeletePosibilities';
import { updateCategories } from './updateCategories';
import { updateWebAppProdCatCache } from './updateWebAppProdCatCache';

export async function handleDeleteAction(modifiedCategories) {
  const { DELETE } = DATABASE_OPERATIONS;
  const { catWithLessProds, catEnterelyDeleted } = await getDeletePosibilities([...modifiedCategories]);

  if (catWithLessProds.length > 0) {
    // se borra un producto dentro de una categoría
    catWithLessProds.forEach((modCategory) => {
      Logger.log(`Se han eliminado productos de la categoría ${modCategory}`);
    });
    const result = await updateCategories([...modifiedCategories]);
    Logger.log('Caching categories with DELETE action: category left with less prods...');
    await cacheOpResults([...result]);

    Logger.log('Updating web app - PATCH after DELETE product operation...');
    const content = result.flatMap((categoryToCache) => categoryToCache['firestoreName-ID']);
    updateWebAppProdCatCache({ action: 'PATCH', label: 'compose', content });
  }

  if (catEnterelyDeleted.length > 0) {
    // se borra una categoría entera
    // delete from firebase => firestoreID
    deleteFirestoreDocs([...catEnterelyDeleted]); // cambió el contrato
    Logger.log('Caching categories with DELETE action: delete category...');
    await cacheOpResults([...catEnterelyDeleted], DELETE);

    Logger.log('Updating web app - DELETE operation cause a category was deleted...');
    const categoryData = catEnterelyDeleted.flatMap((categoryToDelete) => categoryToDelete.data);
    const content = categoryData.map((product) => product.id);
    updateWebAppProdCatCache({ action: 'DELETE', label: 'compose', content });
  }
}
