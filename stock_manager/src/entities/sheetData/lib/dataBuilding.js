import { validateKey } from '../../../features/databaseUpdate/lib/validateKey';
import { COLUMN_HEADERS, INITIAL_URL_FRAGMENTS, SPREADSHEET } from '../config/spreadsheet';
import { fetchSheetData } from './fetchSheetData';

/**
 * @returns {product[]} Array of products
 */
export async function dataBuilding(sheet) {
  const { PRODUCTS: productsKeys, COMBOS: combosKeys } = COLUMN_HEADERS;
  const { STOCK_SPREADSHEET_ID, COMBOS } = SPREADSHEET;
  const isCombo = sheet === COMBOS;
  const requiredKeys = isCombo ? combosKeys : productsKeys;

  return fetchSheetData(STOCK_SPREADSHEET_ID, sheet, requiredKeys).then(({ rawData, headerIndexes }) => {
    if (!rawData.length) throw new Error('No se pudo compilar la información de productos para actualizar la app');

    const toDatabaseData = [];
    let stockIndex;
    let idIndex;
    let imageIndex;
    let categoryIndex;
    let productsIndex;
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
          if (typeof stockIndex === 'undefined' && requiredKeys?.stock?.test(dataField)) {
            stockIndex = appRowIndex;
          }
          if (typeof idIndex === 'undefined' && requiredKeys.id.test(dataField)) {
            idIndex = appRowIndex;
          }
          if (typeof categoryIndex === 'undefined' && requiredKeys.category.test(dataField)) {
            categoryIndex = appRowIndex;
          }
          if (typeof imageIndex === 'undefined' && requiredKeys.image.test(dataField)) {
            imageIndex = appRowIndex;
          }
          if (typeof productsIndex === 'undefined' && requiredKeys?.products?.test(dataField)) {
            productsIndex = appRowIndex;
          }
          product = null;
          const validatedKey = validateKey(dataField, requiredKeys);
          productKeymap.push(validatedKey);
          return;
        }
        /**
         * If there is not a valid productID, or there's not a valid category,
         * the product is ignored
         */
        const stringId = String(arr[idIndex]);
        const hasValidId = stringId.includes('#') || stringId.includes('*');
        const hasValidCategory = String(arr[categoryIndex]).length > 0;
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

        if (appRowIndex === productsIndex) {
          const hasValidProds = typeof dataField === 'string' && dataField?.length > 0 && dataField?.includes('#');
          if (!hasValidProds) {
            product[productKeymap[appRowIndex]] = [];
            return;
          }
          product[productKeymap[appRowIndex]] = dataField
            .replace('\n', '')
            .trim()
            .split('/')
            .map((combo) => {
              if (combo) return null;
              let processCombo = combo;
              if (processCombo.includes('/')) {
                processCombo = processCombo.replace('/', '');
              }
              if (processCombo.includes('-')) {
                return processCombo.trim().split('-');
              }
              return [processCombo.trim(), String(1)];
            })
            .filter(Boolean);
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
          const imageURL = dataField && String(dataField);
          INITIAL_URL_FRAGMENTS.forEach((fragment) => {
            if (imageURL?.includes(fragment)) {
              imageID = imageURL.slice(fragment.length);
            }
          });
          product[productKeymap[appRowIndex]] = imageID || imageURL;
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
        product.isCombo = isCombo;
      });

      if (sheet === COMBOS && product?.products?.length === 0) {
        product = null;
      }
      toDatabaseData.push(product);
      product = {};
    });

    return toDatabaseData.filter(Boolean);
  });
}
//   const toDatabaseData = [];
//   let stockIndex;
//   let idIndex;
//   let imageIndex;
//   let categoryIndex;
//   let productsIndex;
//   const productKeymap = [];
//   let product = {};
//   /**
//    * Build the rows of needed data out of raw data
//    */
//   rawData.forEach((rawRow, rawDataIndex) => {
//     const productReqDataRow = [];
//     headerIndexes.forEach((headerIndex) => productReqDataRow.push(rawRow[headerIndex]));
//     /**
//      *  Make some changes in data to build each product
//      */
//     productReqDataRow.forEach((dataField, appRowIndex, arr) => {
//       if (rawDataIndex === 0) {
//         if (typeof stockIndex === 'undefined' && requiredKeys?.stock?.test(dataField)) {
//           stockIndex = appRowIndex;
//         }
//         if (typeof idIndex === 'undefined' && requiredKeys.id.test(dataField)) {
//           idIndex = appRowIndex;
//         }
//         if (typeof categoryIndex === 'undefined' && requiredKeys.category.test(dataField)) {
//           categoryIndex = appRowIndex;
//         }
//         if (typeof imageIndex === 'undefined' && requiredKeys.image.test(dataField)) {
//           imageIndex = appRowIndex;
//         }
//         if (typeof productsIndex === 'undefined' && requiredKeys?.products?.test(dataField)) {
//           productsIndex = appRowIndex;
//         }
//         product = null;
//         const validatedKey = validateKey(dataField, requiredKeys);
//         productKeymap.push(validatedKey);
//         return;
//       }
//       /**
//        * If there is not a valid productID, or there's not a valid category,
//        * the product is ignored
//        */
//       const stringId = String(arr[idIndex]);
//       const hasValidId = stringId.includes('#') || stringId.includes('*');
//       const hasValidCategory = String(arr[categoryIndex]).length > 0;
//       if (!hasValidId || !hasValidCategory) {
//         product = null;
//         return;
//       }
//       /**
//        * If there is stock available for the product, for firestore database, it becomes true/false
//        */
//       if (appRowIndex === stockIndex) {
//         if (!dataField || Number(dataField) === 0) {
//           product[productKeymap[appRowIndex]] = false;
//         } else {
//           product[productKeymap[appRowIndex]] = true;
//         }
//         return;
//       }

//       if (appRowIndex === productsIndex) {
//         const hasValidProds = typeof dataField === 'string' && dataField?.length > 0 && dataField?.includes('#');

//         if (!hasValidProds) {
//           product[productKeymap[appRowIndex]] = [];
//           return;
//         }
//         product[productKeymap[appRowIndex]] = dataField
//           .replace('\n', '')
//           .trim()
//           .split('//')
//           .map((combo) => {
//             if (!combo) return null;
//             return combo.trim().split('-');
//           })
//           .filter(Boolean);
//         return;
//       }
//       /**
//        *  Add to the image complete URL field, an only image ID field.
//        *  Althought It's a public URL, Drive limits its access when It'done
//        *  repeatidly. Better, we access images through firebase storage URL, and
//        *  that's why It's needed only the ID.
//        */
//       if (appRowIndex === imageIndex) {
//         let imageID;
//         const imageURL = dataField && String(dataField);
//         INITIAL_URL_FRAGMENTS.forEach((fragment) => {
//           if (imageURL?.includes(fragment)) {
//             imageID = imageURL.slice(fragment.length);
//           }
//         });
//         product[productKeymap[appRowIndex]] = imageID || imageURL;
//         product.imageURL = imageURL;
//         /**
//          *  We leave unchanged the image URL to display in the application sheet
//          */
//         return;
//       }
//       /**
//        *  By default, no changes are applied
//        */
//       product[productKeymap[appRowIndex]] = typeof dataField === 'string' ? dataField.trim() : dataField;
//     });

//     if (sheet === COMBOS && product?.products?.length === 0) {
//       product = null;
//     }
//     toDatabaseData.push(product);
//     product = {};
//   });

//   return toDatabaseData.filter(Boolean);
// });
// }
