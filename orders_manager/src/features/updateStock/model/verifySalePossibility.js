export function verifySalePossibility(incommingOrderData) {
  const completeOrderSalePossibility = { ...incommingOrderData };

  const completeSalePossibility = incommingOrderData.cart.map(({ productCurrentStock, decrementQuantity }, index) => {
    const newStockQuantity = productCurrentStock - decrementQuantity;
    const isSaleProssible = productCurrentStock !== 0 && newStockQuantity >= 0;
    completeOrderSalePossibility.cart[index].salePossibility = isSaleProssible;
    completeOrderSalePossibility.cart[index].newStockQuantity = newStockQuantity;
    return isSaleProssible;
  });
  const completePossibleValues = [...new Set(completeSalePossibility)];
  const onlyTruthyValues = completePossibleValues.filter(Boolean);
  const isGlobalSalePossible = completePossibleValues.length === onlyTruthyValues.length;

  return {
    isGlobalSalePossible,
    ...completeOrderSalePossibility,
  };
}
