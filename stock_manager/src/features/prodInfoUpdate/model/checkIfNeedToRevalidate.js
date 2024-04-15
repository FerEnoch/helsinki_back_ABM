import { DATABASE_OPERATIONS } from '../../../shared/api/config/database-operations';
import { analizeProductsToUpdateDatabase } from '../../databaseUpdate/lib/analizeProductsToUpdateDatabase';
import { getProdsFromCache } from '../lib/getProdsFromCache';

export async function checkIfNeedToRevalidate(compiledProds, cacheCategories) {
  const { LEAVE } = DATABASE_OPERATIONS;
  const isCacheOudated = new Set();

  const cacheProds = getProdsFromCache(cacheCategories);

  const actionsByProduct = analizeProductsToUpdateDatabase(compiledProds, cacheProds);
  actionsByProduct.forEach(({ action, content }) => {
    const categorySet = new Set();
    if (content.length > 0) {
      isCacheOudated.add(action !== LEAVE);
      content.forEach((prod) => {
        categorySet.add(prod.category);
      });
      // console.log( /* eslint-disable-line*/
      //   `
      //  CATEGORIES ANALIZED (${categorySet.size}) --> ${[...categorySet]}
      //    ${content.length} items to ${action}
      //  `
      // );
    }
  });

  return isCacheOudated.has(true);
}
