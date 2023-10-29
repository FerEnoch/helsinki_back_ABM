import { STOCK_PRODUCTS_SHEET_ID, STOCK_PRODUCTS_SHEET_NAME } from '../config';
import { alertUI } from '../../../shared/lib/alertUI';
import { setSheetValue } from '../lib/setSheetValue';

export async function updateStockSheet({ row, cart }) {
  let byProductLoggerMessage = '';
  let noMoreProductStockAlertMessage = `Se actualizó el stock para el pedido de la fila ${row}.
  El pedido se realizó correctamente, pero NO QUEDA MÁS STOCK del producto: `;

  const updateStockSheetResult = Promise.all(
    cart.map(async ({ productID, stockSheetStockRange, newStockQuantity }) => {
      return setSheetValue(STOCK_PRODUCTS_SHEET_ID, STOCK_PRODUCTS_SHEET_NAME, stockSheetStockRange, newStockQuantity)
        .then(({ operationResult, newValue }) => {
          if (operationResult !== 'success') {
            throw new Error(
              `** Producto que falló: ${productID}, 
              deberían quedar ${newStockQuantity} unidades, 
              pero no se pudo insertar correctamente en la planilla de stock... 
              quedaron registradas ${newValue} unidades`
            );
          }
          if (newValue === 0) noMoreProductStockAlertMessage += `${productID} - `;
          byProductLoggerMessage += `** Producto ${productID} actualizado en planilla, nuevo stock: ${newValue}\n`;
          return {
            operationResult,
          };
        })
        .catch((error) => {
          throw new Error(`
          La actualización de la planilla de stock ha fallado :( __>
            ${error.message}`);
        });
    })
  );

  const isStockSheetUpdatedSuccessfully = updateStockSheetResult
    .then((updateResults) => updateResults.filter(({ operationResult }) => operationResult === 'success'))
    .then((successUpdateResults) => successUpdateResults.length === cart.length);

  const isStockUpdated = await isStockSheetUpdatedSuccessfully;

  if (noMoreProductStockAlertMessage.includes('#')) {
    alertUI(`${noMoreProductStockAlertMessage}\nActualizar la aplicación de ser necesario`);
  }

  return {
    message: isStockUpdated ? 'Planilla de stock actualizada con el pedido' : 'Ha ocurrido un error inesperado',
    byProductMessage: byProductLoggerMessage,
  };
}
