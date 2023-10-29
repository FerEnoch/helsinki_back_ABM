import {
  STOCK_PRODUCTS_SHEET_ID,
  STOCK_PRODUCTS_SHEET_ID_HEADER,
  STOCK_PRODUCTS_SHEET_NAME,
  STOCK_PRODUCTS_SHEET_STOCK_HEADER,
} from '../config';
import { getAllSheetValues } from '../lib/getAllSheetValues';

export async function contrastWithCurrentStock(orderData) {
  const stockProductsData = await getAllSheetValues(STOCK_PRODUCTS_SHEET_ID, STOCK_PRODUCTS_SHEET_NAME);

  let stockHeaderIndex;
  let idHeaderIndex;
  const completeOrderData = { ...orderData };
  const completeCart = [];

  stockProductsData.forEach((productDataRow, productRow) => {
    productDataRow.forEach((prodDataFieldValue, dataFieldIndex, prodDataRowArr) => {
      if (!prodDataFieldValue) return; // First field must be ID - if doesn's exist, is not a valid row
      if (productRow === 0) {
        // working with headers
        if (prodDataFieldValue.match(STOCK_PRODUCTS_SHEET_STOCK_HEADER)) {
          stockHeaderIndex = dataFieldIndex;
          return;
        }
        if (prodDataFieldValue.match(STOCK_PRODUCTS_SHEET_ID_HEADER)) {
          idHeaderIndex = dataFieldIndex;
          return;
        }
      }
      if (dataFieldIndex !== idHeaderIndex) return;

      const order = {};
      completeOrderData.cart.forEach(([productID, quantity]) => {
        if (prodDataFieldValue !== productID) return;
        order.productCurrentStock = Number(prodDataRowArr[stockHeaderIndex]);
        order.decrementQuantity = Number(quantity);
        order.productID = productID;
        order.stockSheetStockRange = { row: productRow + 1, col: stockHeaderIndex + 1 };
      });
      if (order.productID) completeCart.push(order);
    });
  });
  return {
    ...completeOrderData,
    cart: [...completeCart],
  };
}
