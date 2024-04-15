/**
 *  Constructs the array of data to append to cache sheet (one product per row)
 * @param {Array} data Products array: [ {  'firestoreName-ID': docID, firestoreName: name, ...file } ]
 * @returns {string[][]} Array of data strings array: first array are headers, the following are products
 */

export async function toCacheSheetDataBuilding(dataToBuildCache) {
  const headers = new Set();
  const data = [];
  dataToBuildCache.forEach((fromDatabaseInfo) => {
    const infoArr = [];
    if (!fromDatabaseInfo) return;
    Object.entries(fromDatabaseInfo).forEach(([key, value]) => {
      headers.add(key);
      infoArr.push(value);
    });
    data.push(infoArr);
  });
  /* old-api */
  // const productsData = [];
  // dataToBuildCache.forEach((fromDatabaseProd) => {
  //   const productArr = [];
  //   if (!fromDatabaseProd) return;
  //   Object.keys(fromDatabaseProd).forEach((prodKey) => {
  //     headers.add(prodKey);
  //   });
  //   Object.values(fromDatabaseProd).forEach((productValue) => {
  //     productArr.push(productValue);
  //   });
  //   productsData.push(productArr);
  // });

  // const builtRow = [[...headers], ...productsData];
  const builtRow = [[...headers], ...data];

  return builtRow;
}
