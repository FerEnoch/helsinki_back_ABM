export function isOrderValid(orderRowData) {
  const filteredValidValues = orderRowData.filter(Boolean);
  return filteredValidValues.length === orderRowData.length;
}
