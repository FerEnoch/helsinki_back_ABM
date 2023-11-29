import { fetchSheetData } from './fetchSheetData';
import { COLUMN_HEADERS, INITIAL_URL_FRAGMENTS } from '../config/spreadsheet';
import { validateKey } from '../../../features/databaseUpdate/lib/validateKey';

/**
 *
 * @param  {...any} args Target SpreadsheetID and sheet name
 * @returns {product[]} Array of products
 */
export async function stockDataBuilding(...args) {
  const { PRODUCTS: requiredProductKeys } = COLUMN_HEADERS;

  return fetchSheetData(...args, requiredProductKeys).then(({ rawData, headerIndexes }) => {
    if (!rawData.length) throw new Error('No se pudo compilar la información para actualizar la app');
    const toDatabaseData = [];
    let stockIndex;
    let idIndex;
    let imageIndex;
    let categoryIndex;
    const productKeymap = [];
    let product = {};
    /**
     * Build the rows of needed data out of raw data
     */
    rawData.forEach((rawRow, rawDataIndex) => {
      const productReqDataRow = [];
      headerIndexes.forEach((headerIndex) => productReqDataRow.push(rawRow[headerIndex]));

      /**
       *  Make some changes in data to build each product
       */

      productReqDataRow.forEach((dataField, appRowIndex, arr) => {
        if (rawDataIndex === 0) {
          if (!stockIndex && requiredProductKeys.stock.test(dataField)) {
            stockIndex = appRowIndex;
          }
          if (!idIndex && requiredProductKeys.id.test(dataField)) {
            idIndex = appRowIndex;
          }
          if (!categoryIndex && requiredProductKeys.category.test(dataField)) {
            categoryIndex = appRowIndex;
          }
          if (!imageIndex && requiredProductKeys.image.test(dataField)) {
            imageIndex = appRowIndex;
          }
          product = null;
          const validatedKey = validateKey(dataField, requiredProductKeys);
          productKeymap.push(validatedKey);
          return;
        }
        /**
         * If there is not a valid productID, or there's not a valid category,
         * the product is ignored
         */
        const hasValidId = arr[idIndex].includes('#');
        const hasValidCategory = arr[categoryIndex].length > 0;
        if (!hasValidId || !hasValidCategory) {
          product = null;
          return;
        }
        /**
         * If there is stock available for the product, for firestore database, it becomes true/false
         */
        if (appRowIndex === stockIndex) {
          if (!dataField || Number(dataField) === 0) {
            product[productKeymap[appRowIndex]] = false;
          } else {
            product[productKeymap[appRowIndex]] = true;
          }
          return;
        }
        /**
         *  Add to the image complete URL field, an only image ID field.
         *  Althought It's a public URL, Drive limits its access when It'done
         *  repeatidly. Better, we access images through firebase storage URL, and
         *  that's why It's needed only the ID.
         */
        if (appRowIndex === imageIndex) {
          let imageID;
          const imageURL = dataField;
          INITIAL_URL_FRAGMENTS.forEach((fragment) => {
            if (dataField.includes(fragment)) {
              imageID = dataField.slice(fragment.length);
            }
          });
          product[productKeymap[appRowIndex]] = imageID || dataField;
          product.imageURL = imageURL;
          /**
           *  We leave unchanged the image URL to display in the application sheet
           */
          return;
        }
        /**
         *  By default, no changes are applied
         */
        product[productKeymap[appRowIndex]] = typeof dataField === 'string' ? dataField.trim() : dataField;
      });
      toDatabaseData.push(product);
      product = {};
    });

    const finalProdsCompilation = [];
    toDatabaseData.forEach((prod) => {
      if (!prod) return;
      finalProdsCompilation.push({ ...prod });
    });
    return finalProdsCompilation;
  });
}
