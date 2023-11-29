/**
 *  Constructs the array of data to append to cache sheet (one product per row)
 * @param {Array} data Products array: [ {  'firestoreName-ID': docID, firestoreName: name, ...file } ]
 * @returns {string[][]} Array of data strings array: first array are headers, the following are products
 */

export async function toCacheSheetDataBuilding(dataToBuildCache) {
  const headers = new Set();
  const productsData = [];
  dataToBuildCache.forEach((fromDatabaseProd) => {
    const productArr = [];
    if (!fromDatabaseProd) return;
    Object.keys(fromDatabaseProd).forEach((prodKey) => {
      headers.add(prodKey);
    });
    Object.values(fromDatabaseProd).forEach((productValue) => {
      productArr.push(productValue);
    });
    productsData.push(productArr);
  });

  const builtRow = [[...headers], ...productsData];

  return builtRow;
}
