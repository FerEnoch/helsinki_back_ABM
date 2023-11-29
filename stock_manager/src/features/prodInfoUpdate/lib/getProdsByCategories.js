export function getProdsByCategories(stockData) {
  const categories = new Set();

  stockData.forEach((product) => {
    categories.add(product.category);
  });

  const prodsByCategories = new Map();

  [...categories].forEach((category) => {
    const filteredProd = stockData.filter((prod) => prod.category === category);
    prodsByCategories.set(category, filteredProd);
  });

  return prodsByCategories.size > 0 ? prodsByCategories : null;
}
