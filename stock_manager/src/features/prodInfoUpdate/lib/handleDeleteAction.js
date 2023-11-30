import { deleteFirestoreDocs } from '../../../shared/api/lib/deleteFirestoreDocs';
import { getDeletePosibilities } from './getDeletePosibilities';
import { updateCategories } from './updateCategories';

export async function handleDeleteAction(modifiedCategories) {
  let categoriesToCache = [];
  const { catWithLessProds, catEnterelyDeleted } = await getDeletePosibilities([...modifiedCategories]);

  if (catWithLessProds.length > 0) {
    // se borra un producto dentro de una categoría
    catWithLessProds.forEach((modCategory) => {
      console.log(`Se han eliminado productos de la categoría ${modCategory}`);
    });
    const result = await updateCategories([...modifiedCategories]);
    result.forEach((updatedCat) => categoriesToCache.push(updatedCat));
  }

  if (catEnterelyDeleted.length > 0) {
    // se borra una categoría entera
    catEnterelyDeleted.forEach(({ category, firestoreID }) => {
      console.log(`Se ha eliminado la categoría: ${category} - ID: ${firestoreID}`);
      categoriesToCache = categoriesToCache.filter((modCat) => modCat['firestoreName-ID'] !== firestoreID);
    });
    // delete from firebase => firestoreID
    deleteFirestoreDocs([...catEnterelyDeleted]);
  }
  return [...categoriesToCache].flat();
}
