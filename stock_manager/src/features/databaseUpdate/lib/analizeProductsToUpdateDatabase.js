import { DATABASE_OPERATIONS } from '../../../shared/api/config/database-operations';

/**
 *
 * @param {Product[]} newData
 * @param {Product[]} cachedData
 * @returns {{action: String, content: Product[]}[]} Products array and the coresponding action to do with them
 */
export function analizeProductsToUpdateDatabase(newData, cachedData) {
  const { LEAVE, CREATE, UPDATE, DELETE } = DATABASE_OPERATIONS;

  const comparisonResult = [];

  const toLeaveProdsSet = new Set();
  const toUpdateProdsSet = new Set();
  const toAddProdsSet = new Set();
  const toDeleteFromDatabaseProdsSet = new Set();

  newData.forEach((newProd) => {
    if (newProd === null || newProd === undefined) return;
    /* If no cache data is found, adds every product as new to firebase */
    if (!cachedData.length) {
      toAddProdsSet.add({ ...newProd });
      return;
    }
    const newProdkeys = new Set();
    const isCompletelyEqual = new Set();
    const match = cachedData.find((cachedProduct) => cachedProduct?.id === newProd?.id);
    if (match) {
      Object.keys(newProd).forEach((prodKey) => newProdkeys.add(prodKey));
      Array.from(newProdkeys).forEach((prodKey) => {
        isCompletelyEqual.add(match[prodKey] === newProd[prodKey]);
        /**
         * Testing logs
         */
        // /* eslint-disable-next-line */
        // console.log([
        //    newProd[prodKey],
        //    match[prodKey],
        //    'Are equal -->',
        //    newProd[prodKey] === match[prodKey],
        //  ]);
        /**
         *
         */
      });
      if (!isCompletelyEqual.has(false)) {
        /** Products with no changes - product is returned */
        toLeaveProdsSet.add({ ...match });
      } else {
        /** Products with changes - new product is returned */
        toUpdateProdsSet.add({
          ...newProd,
          'firestoreName-ID': match['firestoreName-ID'],
        });
      }
    } else {
      /** Product no found in cache - product to add to database is returned */
      toAddProdsSet.add(newProd);
    }
  });

  cachedData.forEach((cachedProduct) => {
    if (!cachedProduct) return;
    const match = newData.find((newProd) => cachedProduct?.id === newProd?.id);
    if (match) return;
    /** Products to delete from firestore and web app cache */
    toDeleteFromDatabaseProdsSet.add({ ...cachedProduct });
  });

  comparisonResult.push({
    action: LEAVE,
    content: [...toLeaveProdsSet],
  });
  comparisonResult.push({
    action: UPDATE,
    content: [...toUpdateProdsSet],
  });
  comparisonResult.push({
    action: CREATE,
    content: [...toAddProdsSet],
  });
  comparisonResult.push({
    action: DELETE,
    content: [...toDeleteFromDatabaseProdsSet],
  });

  return comparisonResult;
}
