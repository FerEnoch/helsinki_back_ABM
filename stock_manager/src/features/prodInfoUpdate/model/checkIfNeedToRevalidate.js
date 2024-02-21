import { DATABASE_OPERATIONS } from '../../../shared/api/config/database-operations';
import { analizeProductsToUpdateDatabase } from '../../databaseUpdate/lib/analizeProductsToUpdateDatabase';

export async function checkIfNeedToRevalidate(...args) {
  const { LEAVE } = DATABASE_OPERATIONS;
  const isCacheOudated = new Set();

  const actionsByProduct = analizeProductsToUpdateDatabase(...args);
  actionsByProduct.forEach(({ action, content }) => {
    const categorySet = new Set();
    if (content.length > 0) {
      isCacheOudated.add(action !== LEAVE);
      content.forEach((prod) => {
        categorySet.add(prod.category);
      });
      Logger.log(`
        ACTION: ${action} 
        ITEMS: ${content.length}
        CATEGORIES: ${[...categorySet]}
       `);
    }
  });

  return isCacheOudated.has(true);
}
