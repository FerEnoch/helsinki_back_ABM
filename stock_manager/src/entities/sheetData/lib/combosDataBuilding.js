import { validateKey } from '../../../features/databaseUpdate/lib/validateKey';
import { COLUMN_HEADERS, INITIAL_URL_FRAGMENTS, SPREADSHEET } from '../config/spreadsheet';
import { fetchSheetData } from './fetchSheetData';

export async function combosDataBuilding() {
  const { STOCK_SPREADSHEET_ID, COMBOS } = SPREADSHEET;
  const { COMBOS: requiredCombosKeys } = COLUMN_HEADERS;

  return fetchSheetData(STOCK_SPREADSHEET_ID, COMBOS, requiredCombosKeys).then(({ rawData, headerIndexes }) => {
    if (!rawData.length) throw new Error('No se pudo compilar la información de combos para actualizar la app');
    const toDatabaseData = [];
    let imageIndex;
    const comboKeymap = [];
    let combo = {};
    /**
     * Build the rows of needed data out of raw data
     */
    rawData.forEach((rawRow, rawDataIndex) => {
      const productReqDataRow = [];
      headerIndexes.forEach((headerIndex) => productReqDataRow.push(rawRow[headerIndex]));

      /**
       *  Make some changes in data to build each product
       */

      productReqDataRow.forEach((dataField, appRowIndex) => {
        if (rawDataIndex === 0) {
          // if (!stockIndex && requiredCombosKeys.stock.test(dataField)) {
          //   stockIndex = appRowIndex;
          // }
          // if (!categoryIndex && requiredCombosKeys.category.test(dataField)) {
          //   categoryIndex = appRowIndex;
          // }
          if (!imageIndex && requiredCombosKeys.image.test(dataField)) {
            imageIndex = appRowIndex;
          }
          combo = null;
          const validatedKey = validateKey(dataField, requiredCombosKeys);
          comboKeymap.push(validatedKey);
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

    const finalCombosCompilation = [];
    toDatabaseData.forEach((buildedCombo) => {
      if (!buildedCombo) return;
      finalCombosCompilation.push({ ...buildedCombo });
    });
    return finalCombosCompilation;
  });
}
