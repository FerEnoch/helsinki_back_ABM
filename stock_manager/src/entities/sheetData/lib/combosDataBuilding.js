import { validateKey } from '../../../features/databaseUpdate/lib/validateKey';
import { COLUMN_HEADERS, INITIAL_URL_FRAGMENTS, SPREADSHEET } from '../config/spreadsheet';
import { fetchSheetData } from './fetchSheetData';

/**
 * @returns {combo[]} Array of combos
 */
export async function combosDataBuilding() {
  const { STOCK_SPREADSHEET_ID, COMBOS } = SPREADSHEET;
  const { COMBOS: requiredCombosKeys } = COLUMN_HEADERS;

  return fetchSheetData(STOCK_SPREADSHEET_ID, COMBOS, requiredCombosKeys).then(({ rawData, headerIndexes }) => {
    if (!rawData.length) throw new Error('No se pudo compilar la información de combos para actualizar la app');
    const toDatabaseData = [];
    let imageIndex;
    let idIndex;
    let categoryIndex;
    const comboKeymap = [];
    let combo = {};
    /**
     * Build the rows of needed data out of raw data
     */
    console.log({ rawData, headerIndexes });
    rawData.forEach((rawRow, rawDataIndex) => {
      const comboReqDataRow = [];
      headerIndexes.forEach((headerIndex) => comboReqDataRow.push(rawRow[headerIndex]));

      /**
       *  Make some changes in data to build each product
       */

      comboReqDataRow.forEach((dataField, appRowIndex, arr) => {
        if (rawDataIndex === 0) {
          if (!idIndex && requiredCombosKeys.id.test(dataField)) {
            idIndex = appRowIndex;
          }
          if (!categoryIndex && requiredCombosKeys.category.test(dataField)) {
            categoryIndex = appRowIndex;
          }
          if (!imageIndex && requiredCombosKeys.image.test(dataField)) {
            imageIndex = appRowIndex;
          }
          combo = null;
          const validatedKey = validateKey(dataField, requiredCombosKeys);
          comboKeymap.push(validatedKey);
          return;
        }
        /**
         * If there is not a valid productID, or there's not a valid category,
         * the product is ignored
         */
        const hasValidId = String(arr[idIndex]).includes('*');
        const hasValidCategory = String(arr[categoryIndex]).length > 0;
        if (!hasValidId || !hasValidCategory) {
          combo = null;
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
          combo[comboKeymap[appRowIndex]] = imageID || dataField;
          combo.imageURL = imageURL;
          /**
           *  We leave unchanged the image URL to display in the application sheet
           */
          return;
        }
        combo[comboKeymap[appRowIndex]] = typeof dataField === 'string' ? dataField.trim() : dataField;
      });
      toDatabaseData.push(combo);
      combo = {};
    });

    // const finalCombosCompilation = [];
    // toDatabaseData.forEach((buildedCombo) => {
    //   if (!buildedCombo) return;
    //   finalCombosCompilation.push({ ...buildedCombo });
    // });
    return toDatabaseData.filter(Boolean);
  });
}
