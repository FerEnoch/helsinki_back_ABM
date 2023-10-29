export function canMakeTheSale(productSaleQuantity, currentProductQuantity) {
  const currentQuantity = Number(currentProductQuantity);
  const sale = Number(productSaleQuantity);

  return currentQuantity !== 0 && currentQuantity - sale >= 0;
}
