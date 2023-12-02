import { DATABASE_API_ACTIONS } from '../../../shared/api';
import { DATABASE_OPERATIONS } from '../../../shared/api/config/database-operations';
import { DATABASE_FOLDERS } from '../../../shared/api/config/firebase-api';
import { getProdsByCategories } from './getProdsByCategories';

export function handleCreateCategory(modifiedProducts) {
  // se crea una nueva categoría
  const { PRODUCTS_BY_CATEGORIES: productsFolder } = DATABASE_FOLDERS;
  const { CREATE } = DATABASE_OPERATIONS;
  const newProductsByCategoryMap = getProdsByCategories([...modifiedProducts]);

  const firestoreCategoryCreated = [];

  if (!newProductsByCategoryMap) {
    throw new Error('Unable to build products by categories to update firestore database');
  }

  [...newProductsByCategoryMap.entries()].forEach(([category, prods]) => {
    Logger.log(`${category} created`);
    const firestoreProductsDocument = {
      folder: productsFolder,
      docLabel: category,
      data: [...prods], // Important that 'data' stays last
    };

    const returnedInfo = DATABASE_API_ACTIONS[CREATE](firestoreProductsDocument);
    firestoreCategoryCreated.push({
      category, // Important that 'category' stays first
      ...returnedInfo,
    });
  });
  return [...firestoreCategoryCreated];
}
