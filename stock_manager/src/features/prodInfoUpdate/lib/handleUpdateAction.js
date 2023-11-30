import { updateCategories } from './updateCategories';

export async function handleUpdateAction(modifiedCategories) {
  // se actualiza un producto dentro de una categoría
  const categoriesToCache = [];
  Logger.log(`Product/s modified into existing categories - updating category...`);
  const result = await updateCategories([...modifiedCategories]);
  result.forEach((updatedCat) => categoriesToCache.push(updatedCat));

  return [...categoriesToCache].flat();
}
